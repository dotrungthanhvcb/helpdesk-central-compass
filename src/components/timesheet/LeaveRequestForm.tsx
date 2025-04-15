
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import { LeaveType } from '@/types/index';

const LeaveRequestForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const navigate = useNavigate();
  const { createLeaveRequest } = useApp();
  const { toast } = useToast();
  
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate number of days
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    return Math.max(0, differenceInCalendarDays(end, start) + 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const totalDays = calculateDays();
      
      createLeaveRequest({
        type: leaveType,
        startDate,
        endDate,
        totalDays,
        reason,
      });
      
      toast({
        title: "Yêu cầu nghỉ phép đã được tạo",
        description: "Yêu cầu nghỉ phép của bạn đã được gửi và đang chờ phê duyệt",
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/timesheets');
      }
    } catch (error: any) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể tạo yêu cầu nghỉ phép",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yêu cầu nghỉ phép</CardTitle>
        <CardDescription>
          Tạo yêu cầu nghỉ phép mới
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="leave-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leaveType">Loại nghỉ phép</Label>
            <Select value={leaveType} onValueChange={(value) => setLeaveType(value as LeaveType)} required>
              <SelectTrigger id="leaveType">
                <SelectValue placeholder="Chọn loại nghỉ phép" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Nghỉ phép có lương</SelectItem>
                <SelectItem value="annual">Nghỉ phép năm</SelectItem>
                <SelectItem value="sick">Nghỉ ốm</SelectItem>
                <SelectItem value="unpaid">Nghỉ không lương</SelectItem>
                <SelectItem value="wfh">Làm việc tại nhà</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Lý do nghỉ phép</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do nghỉ phép của bạn"
              rows={3}
            />
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tổng số ngày:</span>
              <span className="text-lg font-bold">{calculateDays()} ngày</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/timesheets')}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button 
          type="submit" 
          form="leave-form"
          disabled={isSubmitting || !leaveType || calculateDays() <= 0}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeaveRequestForm;
