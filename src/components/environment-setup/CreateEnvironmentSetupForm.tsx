
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { useApp } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeviceType, SetupLocation } from '@/types';

// Define form schema
const formSchema = z.object({
  employeeName: z.string().min(3, {
    message: "Tên nhân viên phải có ít nhất 3 ký tự.",
  }),
  deviceType: z.enum(["laptop", "pc", "vm", "byod"] as const),
  setupLocation: z.enum(["onsite", "remote"] as const),
  requestDate: z.date(),
  responsibleName: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CreateEnvironmentSetupFormProps = {
  onSuccess: () => void;
};

export const CreateEnvironmentSetupForm = ({ onSuccess }: CreateEnvironmentSetupFormProps) => {
  const { createEnvironmentSetup, user } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    requestDate: new Date(),
  };

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Here we would normally send this to the API
      // For now, we'll create a mock implementation
      await createEnvironmentSetup({
        id: `setup-${Date.now()}`,
        employeeId: `emp-${Date.now()}`,
        employeeName: data.employeeName,
        deviceType: data.deviceType as DeviceType,
        setupLocation: data.setupLocation as SetupLocation,
        requestDate: format(data.requestDate, 'yyyy-MM-dd'),
        responsibleId: data.responsibleName ? `resp-${Date.now()}` : undefined,
        responsibleName: data.responsibleName || undefined,
        status: 'pending',
        notes: data.notes,
        items: [
          {
            id: `item-${Date.now()}-1`,
            title: 'Device provisioning',
            category: 'device',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `item-${Date.now()}-2`,
            title: 'MDM configuration',
            category: 'mdm',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `item-${Date.now()}-3`,
            title: 'OS Installation / VPN',
            category: 'os',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `item-${Date.now()}-4`,
            title: 'Software setup (IDE, Communication tools)',
            category: 'software',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `item-${Date.now()}-5`,
            title: 'Account & Access Setup',
            category: 'account',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      onSuccess();
    } catch (error) {
      console.error('Failed to create environment setup request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên nhân viên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên nhân viên" {...field} />
                </FormControl>
                <FormDescription>
                  Tên của nhân viên cần thiết lập môi trường làm việc
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại thiết bị</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại thiết bị" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="pc">PC</SelectItem>
                    <SelectItem value="vm">VM</SelectItem>
                    <SelectItem value="byod">BYOD</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Loại thiết bị cần được thiết lập
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="setupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa điểm thiết lập</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn địa điểm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="onsite">Tại văn phòng</SelectItem>
                    <SelectItem value="remote">Từ xa</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Nơi thiết lập môi trường làm việc
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requestDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày yêu cầu</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormDescription>
                  Ngày cần hoàn thành thiết lập
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsibleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người phụ trách IT</FormLabel>
                <FormControl>
                  <Input placeholder="Tên người phụ trách IT" {...field} />
                </FormControl>
                <FormDescription>
                  Người sẽ phụ trách thiết lập
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập các yêu cầu đặc biệt hoặc lưu ý"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Các yêu cầu đặc biệt hoặc hướng dẫn cho việc thiết lập
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle>Các mục thiết lập mặc định</CardTitle>
            <CardDescription>
              Các mục sau sẽ được tạo tự động cho yêu cầu thiết lập này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>Cấp phát thiết bị</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>Cấu hình MDM</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>Cài đặt hệ điều hành / VPN</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>Cài đặt phần mềm (IDE, công cụ giao tiếp)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>Thiết lập tài khoản & quyền truy cập</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : "Tạo yêu cầu thiết lập"}
        </Button>
      </form>
    </Form>
  );
};
