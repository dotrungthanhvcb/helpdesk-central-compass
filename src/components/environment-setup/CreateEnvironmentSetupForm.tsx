import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useApp } from "@/contexts/AppContext";
import { EnvironmentSetup, DeviceType, SetupLocation, SetupItem } from '@/types';

const formSchema = z.object({
  employeeId: z.string().min(3, {
    message: "Employee ID must be at least 3 characters.",
  }),
  employeeName: z.string().min(3, {
    message: "Employee name must be at least 3 characters.",
  }),
  deviceType: z.enum(['laptop', 'pc', 'vm', 'byod']),
  setupLocation: z.enum(['onsite', 'remote']),
  responsibleId: z.string().optional(),
  responsibleName: z.string().optional(),
  notes: z.string().optional(),
})

interface CreateEnvironmentSetupFormProps {
  onSuccess?: () => void;
}

export const CreateEnvironmentSetupForm: React.FC<CreateEnvironmentSetupFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createEnvironmentSetup, users } = useApp();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      employeeName: "",
      deviceType: "laptop",
      setupLocation: "onsite",
      responsibleId: "",
      responsibleName: "",
      notes: "",
    },
  })
  
  const [responsibleName, setResponsibleName] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const responsibleId = form.getValues("responsibleId");
    const responsible = users.find(user => user.id === responsibleId);
    setResponsibleName(responsible?.name);
    form.setValue("responsibleName", responsible?.name);
  }, [form, users]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { employeeId, employeeName, deviceType, setupLocation, responsibleId, notes } = values;

    const defaultItems: SetupItem[] = [
      {
        id: `item-${Date.now()}-1`,
        title: "Tạo tài khoản Jira",
        category: "account",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `item-${Date.now()}-2`,
        title: "Cấp quyền truy cập SharePoint",
        category: "account",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `item-${Date.now()}-3`,
        title: "Thiết lập Laptop/Tablet (VCB Tablet)",
        category: "device",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `item-${Date.now()}-4`,
        title: "Cấp quyền truy cập GitLab",
        category: "account",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `item-${Date.now()}-5`,
        title: "Thiết lập VPN",
        category: "os",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `item-${Date.now()}-6`,
        title: "Whitelist MAC Address, mở firewall",
        category: "os",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `item-${Date.now()}-7`,
        title: "Cài đặt phần mềm (Zoom, VSCode,...)",
        category: "software",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const newSetup: Omit<EnvironmentSetup, "id" | "createdAt" | "updatedAt"> = {
      employeeId: employeeId,
      employeeName: employeeName,
      deviceType: deviceType as DeviceType,
      setupLocation: setupLocation as SetupLocation,
      requestDate: new Date().toISOString().split('T')[0],
      responsibleId: responsibleId || undefined,
      responsibleName: responsibleName || undefined,
      status: 'pending',
      notes: notes || undefined,
      items: defaultItems,
    };
    
    try {
      await createEnvironmentSetup(newSetup);
      toast({
        title: "Yêu cầu đã được tạo",
        description: "Yêu cầu thiết lập môi trường làm việc đã được tạo thành công.",
      })
      
      // Redirect to the environment setup page
      navigate('/environment-setup');
      
      // Execute callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể tạo yêu cầu thiết lập môi trường làm việc. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo yêu cầu thiết lập môi trường</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã nhân viên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã nhân viên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nhân viên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên nhân viên" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="setupLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm làm việc</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa điểm làm việc" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="onsite">Tại văn phòng</SelectItem>
                      <SelectItem value="remote">Từ xa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsibleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người phụ trách</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn người phụ trách" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú nếu có"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Tạo yêu cầu</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
