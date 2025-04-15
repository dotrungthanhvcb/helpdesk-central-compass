
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { SquadRole, Assignment } from "@/types/contracts";

interface AssignmentFormProps {
  onSuccess?: () => void;
  editMode?: boolean;
  assignmentId?: string;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ 
  onSuccess, 
  editMode = false,
  assignmentId
}) => {
  const { 
    createAssignment, 
    updateAssignment, 
    assignments,
    users,
    squads,
    projects
  } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [staffId, setStaffId] = useState<string>("");
  const [role, setRole] = useState<SquadRole>("developer");
  const [squadId, setSquadId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<Assignment['status']>("active");
  const [utilization, setUtilization] = useState<number>(100);

  useEffect(() => {
    if (editMode && assignmentId) {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment) {
        setStaffId(assignment.staffId);
        setRole(assignment.role);
        setSquadId(assignment.squadId || "");
        setProjectId(assignment.projectId || "");
        setStartDate(new Date(assignment.startDate));
        setEndDate(assignment.endDate ? new Date(assignment.endDate) : undefined);
        setStatus(assignment.status);
        setUtilization(assignment.utilization);
      }
    }
  }, [editMode, assignmentId, assignments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!staffId || !role || !startDate) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive",
      });
      return;
    }

    const staffMember = users.find(u => u.id === staffId);
    const squadData = squads.find(s => s.id === squadId);
    const projectData = projects.find(p => p.id === projectId);

    const assignmentData = {
      staffId,
      staffName: staffMember?.name || "Unknown",
      role,
      squadId: squadId || undefined,
      squadName: squadId ? squadData?.name : undefined,
      projectId: projectId || undefined,
      projectName: projectId ? projectData?.name : undefined,
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : undefined,
      status,
      utilization
    };

    try {
      if (editMode && assignmentId) {
        updateAssignment(assignmentId, assignmentData);
        toast({
          title: "Cập nhật thành công",
          description: "Thông tin phân công đã được cập nhật."
        });
      } else {
        createAssignment(assignmentData);
        toast({
          title: "Tạo phân công thành công",
          description: `Phân công cho ${staffMember?.name || 'nhân viên'} đã được tạo.`
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/squad-allocation");
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin phân công. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  const outsourceStaff = users.filter(user => 
    user.role === 'requester' || user.department?.toLowerCase().includes('outsource')
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="staffId">Nhân viên <span className="text-red-500">*</span></Label>
          <Select value={staffId} onValueChange={setStaffId} disabled={editMode}>
            <SelectTrigger id="staffId">
              <SelectValue placeholder="Chọn nhân viên" />
            </SelectTrigger>
            <SelectContent>
              {outsourceStaff.length > 0 ? (
                outsourceStaff.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  Không có nhân viên
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="role">Vai trò <span className="text-red-500">*</span></Label>
          <Select value={role} onValueChange={(value) => setRole(value as SquadRole)}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="qa">QA Engineer</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="tester">Tester</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="devops">DevOps</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="squadId">Nhóm</Label>
            <Select value={squadId} onValueChange={setSquadId}>
              <SelectTrigger id="squadId">
                <SelectValue placeholder="Chọn nhóm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Không có nhóm</SelectItem>
                {squads.map(squad => (
                  <SelectItem key={squad.id} value={squad.id}>
                    {squad.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="projectId">Dự án</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger id="projectId">
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Không có dự án</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Ngày bắt đầu <span className="text-red-500">*</span></Label>
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Ngày kết thúc</Label>
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select 
            value={status} 
            onValueChange={(value) => setStatus(value as Assignment['status'])}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="upcoming">Sắp bắt đầu</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
              <SelectItem value="planned">Đã lên kế hoạch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="utilization">Phân bổ công việc (%)</Label>
            <span className="text-sm text-muted-foreground">{utilization}%</span>
          </div>
          <Slider
            id="utilization"
            value={[utilization]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => setUtilization(value[0])}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/squad-allocation")}
        >
          Hủy
        </Button>
        <Button type="submit">
          {editMode ? "Cập nhật" : "Tạo phân công"}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;
