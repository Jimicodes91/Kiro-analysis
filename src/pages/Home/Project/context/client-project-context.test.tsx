import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Persistence of the client's chosen project across a page refresh.
 *
 * The cookie jar below drops any cookie over 4096 bytes, as browsers do
 * (silently, with no error). A real project has form fields, a project type
 * with its stages, and settings, so it is easily larger than that once saved.
 */

const bulk = (id: string, name: string) => ({
  id,
  name,
  project_type_id: "pt",
  milestone: { id: `m-${id}` },
  form_fields: Array.from({ length: 40 }, (_, i) => ({
    id: `f${i}`,
    name: "A reasonably descriptive field name",
    value: "x".repeat(60),
  })),
});

let projects: any[] = [];

vi.mock("@/layouts/dashboard-layout/client-layout", () => ({
  LayoutWithoutContext: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/services/api.service", () => ({ getUserSession: () => ({ id: "u1" }) }));
vi.mock("@/hooks/project-modules/use-get-client-projects", () => ({
  default: () => ({ isLoading: false, isPending: false, value: { data: projects } }),
}));

import ClientProjectContextProvider, { useClientProjectContext } from "./client-project-context";

function installBrowserLikeCookieJar() {
  const jar = new Map<string, string>();
  Object.defineProperty(document, "cookie", {
    configurable: true,
    get: () => [...jar].map(([k, v]) => `${k}=${v}`).join("; "),
    set: (raw: string) => {
      const [pair, ...attrs] = raw.split(";").map((s) => s.trim());
      const eq = pair.indexOf("=");
      const name = pair.slice(0, eq);
      const value = pair.slice(eq + 1);
      if (name.length + value.length > 4096) return; // browsers silently drop these
      const maxAge = attrs.find((a) => a.toLowerCase().startsWith("max-age="));
      if (maxAge && Number(maxAge.split("=")[1]) <= 0) {
        jar.delete(name);
        return;
      }
      jar.set(name, value);
    },
  });
  return jar;
}

function Probe() {
  const { activeProject, changeActiveProject } = useClientProjectContext();
  return (
    <div>
      <span data-testid="active">{activeProject?.name ?? "none"}</span>
      <span data-testid="milestone">{(activeProject as any)?.milestone?.id ?? "none"}</span>
      {projects.map((p) => (
        <button key={p.id} onClick={() => changeActiveProject(p)}>
          pick {p.name}
        </button>
      ))}
    </div>
  );
}

const mount = () =>
  render(
    <MemoryRouter>
      <ClientProjectContextProvider>
        <Probe />
      </ClientProjectContextProvider>
    </MemoryRouter>
  );

let jar: Map<string, string>;

beforeEach(() => {
  jar = installBrowserLikeCookieJar();
  window.localStorage.clear();
  projects = [bulk("A", "Default project"), bulk("B", "Second project")];
});

afterEach(() => {
  cleanup();
  delete (document as any).cookie;
});

describe("active project survives a refresh", () => {
  it("is large enough that a cookie could not hold it (guards the test itself)", () => {
    const encoded = encodeURIComponent(JSON.stringify(projects[1]));
    expect(encoded.length).toBeGreaterThan(4096);
  });

  it("restores the project the client switched to, not the default", () => {
    const first = mount();
    expect(screen.getByTestId("active")).toHaveTextContent("Default project");

    fireEvent.click(screen.getByRole("button", { name: "pick Second project" }));
    expect(screen.getByTestId("active")).toHaveTextContent("Second project");

    first.unmount(); // a page refresh: everything in memory is gone
    mount();

    expect(screen.getByTestId("active")).toHaveTextContent("Second project");
  });

  it("falls back to the first project when the saved one is no longer assigned", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "pick Second project" }));
    cleanup();

    projects = [bulk("A", "Default project")]; // B was removed from this client
    mount();

    expect(screen.getByTestId("active")).toHaveTextContent("Default project");
  });

  it("keeps the saved project's data fresh from the latest project list", () => {
    const view = mount();
    fireEvent.click(screen.getByRole("button", { name: "pick Second project" }));
    expect(screen.getByTestId("milestone")).toHaveTextContent("m-B");

    // Staff move project B to a new stage; the list refetches.
    projects = [
      bulk("A", "Default project"),
      { ...bulk("B", "Second project"), milestone: { id: "m-B-next" } },
    ];
    act(() => {
      view.rerender(
        <MemoryRouter>
          <ClientProjectContextProvider>
            <Probe />
          </ClientProjectContextProvider>
        </MemoryRouter>
      );
    });

    expect(screen.getByTestId("milestone")).toHaveTextContent("m-B-next");
  });

  it("still honours a project saved by the old version (full object in a cookie)", () => {
    const legacy = { id: "B", name: "Second project" };
    document.cookie = `client_active_project=${encodeURIComponent(JSON.stringify(legacy))}; path=/`;

    mount();

    expect(screen.getByTestId("active")).toHaveTextContent("Second project");
    // The oversized legacy cookie is cleaned up once migrated.
    expect(jar.has("client_active_project")).toBe(false);
  });

  it("ignores a corrupt saved value and shows the first project", () => {
    document.cookie = "client_active_project=%5Bobject%20Object%5D; path=/";
    window.localStorage.setItem("client_active_project_id", "");

    mount();

    expect(screen.getByTestId("active")).toHaveTextContent("Default project");
  });
});
