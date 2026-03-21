---
inclusion: auto
---

# Layout Overflow Prevention Rules

When writing CSS grid or flexbox layouts in this project, follow these rules to prevent horizontal overflow bugs:

## Grid Children
- Any CSS grid child that uses `1fr` or `auto` column sizing MUST have `min-w-0` to prevent content from blowing out the grid boundary.
- This is because CSS grid items default to `min-width: auto`, which prevents them from shrinking below their intrinsic content size.

## Flex Children
- Any flex child that contains dynamic/variable-width content (tables, horizontal lists, breadcrumbs, milestone rows) MUST have `min-w-0` or `overflow-hidden`.

## Scrollable Content
- When using `overflow-x-auto` for horizontal scrolling, the parent container MUST be width-constrained (via `min-w-0`, `overflow-hidden`, or explicit `max-w-*`). Otherwise the overflow-x-auto has no effect and the content just expands the page.

## Page-Level Containers
- All page-level wrappers should include `overflow-hidden` or `overflow-x-hidden` to prevent any child from causing horizontal page scroll.

## Common Pattern
```tsx
{/* Grid layout — right panel needs min-w-0 */}
<div className="grid grid-cols-[280px_1fr]">
  <aside>...</aside>
  <main className="min-w-0">  {/* prevents overflow */}
    <div className="overflow-x-auto">  {/* now scrolls properly */}
      {/* wide content */}
    </div>
  </main>
</div>
```
