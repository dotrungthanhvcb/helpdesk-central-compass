
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths } from "date-fns";
import { ContractType, ContractStatus } from "@/types/contracts";

interface ContractFormProps {
  onSuccess?: (contractId: string) => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSuccess }) => {
  const { createContract, user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [staffName, setStaffName] = useState("");
  const [company, setCompany] = useState("");
  const [contractType, setContractType] = useState<ContractType>("main");
  const [effectiveDate, setEffectiveDate] = useState<Date>(new Date());
  const [expiryDate, setExpiryDate] = useState<Date>(addMonths(new Date(), 12));
  const [status, setStatus] = useState<ContractStatus>("active");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!staffName || !effectiveDate || !expiryDate) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng đăng nhập lại.",
        variant: "destructive",
      });
      return;
    }

    try {
      const contractId = await createContract({
        staffName,
        staffId: `staff-${Date.now()}`, // In a real app, you'd select from existing staff
        company,
        contractType,
        effectiveDate: effectiveDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        status,
        notes,
        signedBy: user.name,
        signedById: user.id,
      });

      toast({
        title: "Tạo hợp đồng thành công",
        description: `Hợp đồng cho ${staffName} đã được tạo.`,
      });

      if (onSuccess) {
        onSuccess(contractId);
      } else {
        navigate(`/contracts/${contractId}`);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo hợp đồng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="staffName">Tên nhân viên <span className="text-red-500">*</span></Label>
          <Input
            id="staffName"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            placeholder="Nhập tên nhân viên"
            required
          />
        </div>

        <div>
          <Label htmlFor="company">Công ty</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Nhập tên công ty cung cấp nhân sự"
          />
        </div>

        <div>
          <Label htmlFor="contractType">Loại hợp đồng <span className="text-red-500">*</span></Label>
          <Select value={contractType} onValueChange={(value) => setContractType(value as ContractType)}>
            <SelectTrigger id="contractType">
              <SelectValue placeholder="Chọn loại hợp đồng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Hợp đồng chính</SelectItem>
              <SelectItem value="nda">NDA</SelectItem>
              <SelectItem value="compliance">Tuân thủ</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Ngày hiệu lực <span className="text-red-500">*</span></Label>
            <DatePicker date={effectiveDate} setDate={setEffectiveDate} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Ngày hết hạn <span className="text-red-500">*</span></Label>
            <DatePicker date={expiryDate} setDate={setExpiryDate} />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as ContractStatus)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="expired">Hết hạn</SelectItem>
              <SelectItem value="terminated">Đã chấm dứt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">Ghi chú</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú về hợp đồng"
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/contracts")}
        >
          Hủy
        </Button>
        <Button type="submit">Tạo hợp đồng</Button>
      </div>
    </form>
  );
};

export default ContractForm;
