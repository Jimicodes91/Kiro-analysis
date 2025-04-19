import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCreateCompany from "@/hooks/company/use-create-company";
import {
  companySizeList,
  COUNTRY_STATES,
  countryList,
  CountryStatesMap,
  industryList,
} from "@/lib/constants";
import { getUserSession, updateUserSession } from "@/services/api.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import { companyDetailsSchema } from "../../components/validationSchema/onboarding";
import { useOnboarding } from "./onboarding-context";

const Step1 = () => {
  const { onNext, updateCompanyDetails, companyData } = useOnboarding();
  const session = getUserSession();
  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const createCompany = useCreateCompany(session?.id ?? "");

  const form = useForm({
    resolver: yupResolver(companyDetailsSchema),
    mode: "onChange",
    defaultValues: companyData,
  });

  // Watch country to dynamically update states
  const watchCountry = form.watch("country");

  useEffect(() => {
    // Type-safe way to check and set states
    if (watchCountry && Object.keys(COUNTRY_STATES).includes(watchCountry)) {
      setStates(COUNTRY_STATES[watchCountry as keyof CountryStatesMap]);
    } else {
      setStates([]);
    }
  }, [watchCountry]);

  // Ensure Redux state is loaded into form
  useEffect(() => {
    form.reset(companyData);
  }, [companyData, form]);

  const onSubmit = async (data: InferType<typeof companyDetailsSchema>) => {
    createCompany
      .mutateAsync(data)
      .then((response) => {
        const res = response?.data?.data;
        const updateFields = {
          company_name: res?.name,
          company_id: res?.id,
        };
        updateUserSession(updateFields);
        updateCompanyDetails(data);
        onNext();
      })
      .catch(console.log);
  };

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-12">Company detail</h1>
      <div className="overflow-y-auto flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="h-12 w-full">
                          <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                            <SelectValue
                              placeholder={
                                <p className="text-brand-placeholder">
                                  Select Industry type
                                </p>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industryList.map((item) => (
                            <SelectItem value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="h-12 w-full">
                          <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                            <SelectValue
                              placeholder={
                                <p className="text-brand-placeholder">Company size</p>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companySizeList.map((item) => (
                            <SelectItem value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="h-12 w-full">
                          <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                            <SelectValue
                              placeholder={
                                <p className="text-brand-placeholder">Country</p>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryList.map((item) => (
                            <SelectItem value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="h-12 bg-black w-full">
                          <SelectTrigger
                            disabled={states.length === 0}
                            className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                          >
                            <SelectValue
                              placeholder={
                                <p className="text-brand-placeholder">
                                  {states.length === 0
                                    ? "Select Country First"
                                    : "Select City"}
                                </p>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((item) => (
                            <SelectItem value={item.value}>{item.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={createCompany.isPending}>
                Save and continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Step1;
