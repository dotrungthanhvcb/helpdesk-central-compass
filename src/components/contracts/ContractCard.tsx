
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Contract, ContractStatus } from "@/types/contracts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Building, User } from "lucide-react";

interface ContractCardProps {
  contract: Contract;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-400";
      case "expired":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-400";
      case "terminated":
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-400";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-400";
    }
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case "main":
        return "Hợp đồng chính";
      case "nda":
        return "NDA";
      case "compliance":
        return "Tuân thủ";
      case "other":
        return "Khác";
      default:
        return type;
    }
  };

  const getStatusLabel = (status: ContractStatus) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "pending":
        return "Chờ xử lý";
      case "expired":
        return "Hết hạn";
      case "terminated":
        return "Đã chấm dứt";
      default:
        return status;
    }
  };

  return (
    <Link to={`/contracts/${contract.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="font-semibold text-lg line-clamp-1">{contract.staffName}</div>
            <Badge className={`${getStatusColor(contract.status)}`}>
              {getStatusLabel(contract.status)}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <FileText className="mr-2 h-4 w-4" />
              <span>{getContractTypeLabel(contract.contractType)}</span>
            </div>

            {contract.company && (
              <div className="flex items-center text-muted-foreground">
                <Building className="mr-2 h-4 w-4" />
                <span className="line-clamp-1">{contract.company}</span>
              </div>
            )}

            <div className="flex items-center text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              <span>Ký bởi: {contract.signedBy}</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {format(new Date(contract.effectiveDate), "dd/MM/yyyy", { locale: vi })} -{" "}
                {format(new Date(contract.expiryDate), "dd/MM/yyyy", { locale: vi })}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
          <div className="flex justify-between w-full">
            <div>Tài liệu: {contract.documents.length}</div>
            <div>
              {new Date(contract.expiryDate) < new Date() ? (
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                  Đã hết hạn
                </Badge>
              ) : new Date(contract.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  Sắp hết hạn
                </Badge>
              ) : null}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ContractCard;
