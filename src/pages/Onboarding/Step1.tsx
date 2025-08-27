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
import { companySizeList, industryList } from "@/lib/constants";
import { getUserSession, updateUserSession } from "@/services/api.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import { companyDetailsSchema } from "../../utils/validation-schema/onboarding";
import { useOnboarding } from "./onboarding-context";

const Step1 = () => {
  const { onNext, updateCompanyDetails, companyData } = useOnboarding();
  const session = getUserSession();
  const createCompany = useCreateCompany(session?.id ?? "");

  const form = useForm({
    resolver: yupResolver(companyDetailsSchema),
    mode: "onChange",
    defaultValues: companyData,
  });

  // Watch country to dynamically update states
  const watchCountry = form.watch("country");
  const watchState = form.watch("state");

  // Ensure Redux state is loaded into form
  useEffect(() => {
    form.reset(companyData);
  }, [companyData, form]);

  const onSubmit = async (data: InferType<typeof companyDetailsSchema>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state, ...others } = data;
    createCompany
      .mutateAsync({
        ...others,
        country: data.country?.name || "",
        city: data.city?.name || "",
      })
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
      .catch(console.error);
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
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
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
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
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
                      <FormControl className="h-12 w-full">
                        <CountrySelect
                          containerClassName="focus-visible:outline-none focus-visible:ring-1! focus-visible:ring-ring! shadow-sm"
                          inputClassName="flex h-20! w-full rounded-full! placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:focus:border-black disabled:focus:bg-white disabled:opacity-50 md:text-sm"
                          onChange={(_country) => {
                            field.onChange(_country);
                            // @ts-expect-error TODO
                            form.setValue("state", "");
                            // @ts-expect-error TODO
                            form.setValue("city", "");
                          }}
                          placeHolder="Select Country"
                        />
                      </FormControl>

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
              <div className="flex  gap-4">
                {watchCountry?.hasStates && (
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>State</FormLabel>
                        <FormControl className="h-12 w-full">
                          <StateSelect
                            disabled={!watchCountry?.id}
                            countryid={watchCountry?.id || 161}
                            containerClassName="focus-visible:outline-none focus-visible:ring-1! focus-visible:ring-ring! shadow-sm"
                            inputClassName="flex h-20! w-full rounded-full! placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:focus:border-black disabled:focus:bg-white disabled:opacity-50 md:text-sm"
                            onChange={(_state) => {
                              field.onChange(_state);
                              // @ts-expect-error TODO
                              form.setValue("city", "");
                            }}
                            placeHolder="Select State"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {watchState?.hasCities && (
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>City</FormLabel>
                        <FormControl className="h-12 w-full">
                          <CitySelect
                            countryid={watchCountry?.id || 161}
                            stateid={watchState?.id}
                            disabled={!watchState?.id}
                            containerClassName="focus-visible:outline-none focus-visible:ring-1! focus-visible:ring-ring! shadow-sm"
                            inputClassName="flex h-20! w-full rounded-full! placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:focus:border-black disabled:focus:bg-white disabled:opacity-50 md:text-sm"
                            onChange={(_city) => field.onChange(_city)}
                            onTextChange={(_txt) => console.log(_txt)}
                            placeHolder="Select City"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
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
            <div className="flex justify-end py-4 pr-1">
              <Button
                type="submit"
                className="z-[99]"
                isLoading={createCompany.isPending}
              >
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
