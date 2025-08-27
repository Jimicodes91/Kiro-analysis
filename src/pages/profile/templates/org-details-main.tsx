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
import { CompanyDetails } from "@/hooks/admin/use-get-company";
import useUpdateCompanyDetails from "@/hooks/company/use-update-company";
import { companySizeList, industryList } from "@/lib/constants";
import { getUserSession } from "@/services/api.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const companyDetailsSchema = yup.object().shape({
  name: yup.string().required("Company name is required"),
  industry_type: yup.string().required("Industry type is required"),
  size: yup.string().required("Company size is required"),
  address: yup.string().required("Company address is required"),
});

const EditOrganizationDetailsMain = ({ company }: { company: CompanyDetails }) => {
  const user = getUserSession();
  const updateCompanyDetails = useUpdateCompanyDetails(user?.company_id ?? "");

  const form = useForm({
    resolver: yupResolver(companyDetailsSchema),
    mode: "onChange",
    defaultValues: {
      name: company?.name,
      industry_type: company?.industry_type,
      size: company?.size,
      address: company?.address,
    },
  });

  const onSubmit = async (data: yup.InferType<typeof companyDetailsSchema>) => {
    updateCompanyDetails
      .mutateAsync({
        ...data,
      })
      .catch(console.log);
  };

  return (
    <div className=" flex flex-col space-y-6 pt-6 animate-in fade-in-0 duration-700 ease-in-out">
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
            </div>
          </div>
          <div className="flex y-4 pr-1 pt-5">
            <Button
              type="submit"
              className="z-[99]"
              isLoading={updateCompanyDetails.isPending}
            >
              Save and continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditOrganizationDetailsMain;
