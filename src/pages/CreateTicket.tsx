
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useApp } from "@/contexts/AppContext";
import { toast } from "@/hooks/use-toast";
import { Ticket, TicketCategory, TicketPriority } from "@/types";
import { ArrowLeftIcon, Upload } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, { message: "Tiêu đề phải có ít nhất 5 ký tự" }).max(100, { message: "Tiêu đề tối đa 100 ký tự" }),
  description: z.string().min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),
  category: z.enum(["tech_setup", "dev_issues", "mentoring", "hr_matters"] as const),
  priority: z.enum(["low", "medium", "high"] as const),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTicket = () => {
  const { createTicket } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "tech_setup",
      priority: "medium",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      createTicket({
        ...data,
        status: "pending",
      });
      
      navigate("/tickets");
      
      toast({
        title: "Yêu cầu hỗ trợ đã được tạo",
        description: "Yêu cầu của bạn đã được gửi và đang chờ xử lý",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Không thể tạo yêu cầu",
        description: "Đã xảy ra lỗi khi tạo yêu cầu của bạn. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tạo yêu cầu hỗ trợ mới</h1>
          <p className="text-muted-foreground">Điền thông tin để tạo yêu cầu hỗ trợ mới</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin yêu cầu</CardTitle>
          <CardDescription>
            Vui lòng cung cấp đầy đủ thông tin để đội ngũ hỗ trợ xử lý yêu cầu nhanh chóng và chính xác
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề yêu cầu</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề ngắn gọn" {...field} />
                    </FormControl>
                    <FormDescription>
                      Tiêu đề rõ ràng giúp nhanh chóng xác định vấn đề
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả chi tiết</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về yêu cầu của bạn, bao gồm các bước tái hiện vấn đề nếu có"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cung cấp đầy đủ thông tin liên quan sẽ giúp giải quyết yêu cầu nhanh hơn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phân loại</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phân loại yêu cầu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tech_setup">Technical Setup (Cài đặt kỹ thuật)</SelectItem>
                          <SelectItem value="dev_issues">Development Issues (Vấn đề phát triển)</SelectItem>
                          <SelectItem value="mentoring">Mentoring (Đào tạo / Hỗ trợ)</SelectItem>
                          <SelectItem value="hr_matters">HR Matters (Vấn đề nhân sự)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Chọn loại yêu cầu phù hợp để chuyển đến bộ phận xử lý đúng
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mức độ ưu tiên</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mức độ ưu tiên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low (Thấp)</SelectItem>
                          <SelectItem value="medium">Medium (Trung bình)</SelectItem>
                          <SelectItem value="high">High (Cao)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Đánh giá mức độ ưu tiên dựa trên tính cấp bách của vấn đề
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Đính kèm tài liệu</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Kéo và thả tệp hoặc click để chọn từ thiết bị
                </p>
                <div className="mt-4">
                  <Input id="file-upload" type="file" className="hidden" />
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label htmlFor="file-upload">Chọn tệp</label>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>Hủy</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo yêu cầu"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTicket;
