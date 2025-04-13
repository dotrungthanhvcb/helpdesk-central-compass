
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";

// Form validation schema
const overtimeFormSchema = z.object({
  date: z.date({
    required_error: "Vui lòng chọn ngày.",
  }),
  startTime: z.string().min(1, "Vui lòng nhập thời gian bắt đầu."),
  endTime: z.string().min(1, "Vui lòng nhập thời gian kết thúc."),
  totalHours: z.number().min(0.5, "Tổng số giờ phải lớn hơn 0.5."),
  reason: z.string().min(5, "Vui lòng nhập lý do chi tiết (ít nhất 5 ký tự)."),
  comment: z.string().optional(),
});

type OvertimeFormValues = z.infer<typeof overtimeFormSchema>;

const OvertimeRequestPage = () => {
  const { createOvertimeRequest } = useApp();
  const navigate = useNavigate();
  
  // Default form values
  const defaultValues: Partial<OvertimeFormValues> = {
    date: new Date(),
    startTime: "",
    endTime: "",
    totalHours: 1,
    reason: "",
    comment: "",
  };

  const form = useForm<OvertimeFormValues>({
    resolver: zodResolver(overtimeFormSchema),
    defaultValues,
  });

  const onSubmit = (data: OvertimeFormValues) => {
    createOvertimeRequest({
      date: format(data.date, "yyyy-MM-dd"),
      startTime: data.startTime,
      endTime: data.endTime,
      totalHours: data.totalHours,
      reason: data.reason,
      comment: data.comment || undefined,
    });
    navigate("/timesheets");
  };

  // Helper to calculate total hours based on start and end time
  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return;
    
    try {
      const [startHour, startMin] = start.split(":").map(Number);
      const [endHour, endMin] = end.split(":").map(Number);
      
      let totalHours = endHour - startHour;
      let totalMinutes = endMin - startMin;
      
      if (totalMinutes < 0) {
        totalHours -= 1;
        totalMinutes += 60;
      }
      
      const totalTime = totalHours + (totalMinutes / 60);
      
      if (totalTime >= 0) {
        form.setValue("totalHours", parseFloat(totalTime.toFixed(1)));
      }
    } catch (error) {
      console.error("Lỗi khi tính toán thời gian:", error);
    }
  };

  return (
    <div className="container py-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/timesheets")}
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Quay lại
      </Button>
      
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-6 w-6" />
            <div>
              <CardTitle className="text-2xl">Tạo yêu cầu làm thêm giờ</CardTitle>
              <CardDescription>Điền thông tin yêu cầu OT của bạn</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày làm thêm giờ</FormLabel>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                    <FormDescription>
                      Chọn ngày bạn làm thêm giờ
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian bắt đầu</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            calculateHours(e.target.value, form.getValues("endTime"));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian kết thúc</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            calculateHours(form.getValues("startTime"), e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="totalHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tổng số giờ</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.5" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Tổng số giờ làm thêm (được tính tự động)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả lý do bạn cần làm thêm giờ..." 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Thêm ghi chú hoặc thông tin bổ sung..." 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Thông tin thêm mà bạn muốn người phê duyệt biết
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/timesheets")}
                >
                  Hủy
                </Button>
                <Button type="submit">Gửi yêu cầu</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OvertimeRequestPage;
