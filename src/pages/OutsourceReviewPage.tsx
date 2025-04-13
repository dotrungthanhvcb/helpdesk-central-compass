
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OutsourceReview, ReviewCriteriaScore, User } from "@/types";
import { format } from "date-fns";
import { FileTextIcon, PlusIcon, SearchIcon, StarIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OutsourceReviewPage = () => {
  const { reviews, users, user, createReview } = useApp();
  const navigate = useNavigate();
  const [isCreatingReview, setIsCreatingReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Only allow admins and supervisors to access this page
  if (user?.role !== "admin" && user?.role !== "supervisor") {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Quyền truy cập bị từ chối</h1>
        <p className="text-muted-foreground mb-6">Bạn không có quyền truy cập vào trang này.</p>
        <Button onClick={() => navigate("/")}>Quay lại Trang chủ</Button>
      </div>
    );
  }
  
  // Only regular users (not admins or supervisors) can be reviewed
  const reviewableUsers = users.filter(u => 
    u.role !== "admin" && 
    u.role !== "supervisor" && 
    u.isActive !== false
  );
  
  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort((a, b) => 
    new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
  );
  
  // Filter reviews based on search
  const filteredReviews = sortedReviews.filter(review => 
    review.revieweeName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group reviews by reviewee
  const reviewsByUser = filteredReviews.reduce<Record<string, OutsourceReview[]>>((acc, review) => {
    if (!acc[review.revieweeId]) {
      acc[review.revieweeId] = [];
    }
    acc[review.revieweeId].push(review);
    return acc;
  }, {});
  
  // Calculate average scores for each user
  const getAverageScores = (userReviews: OutsourceReview[]) => {
    if (userReviews.length === 0) return null;
    
    const sum = userReviews.reduce(
      (acc, review) => {
        acc.technicalQuality += review.criteria.technicalQuality;
        acc.professionalAttitude += review.criteria.professionalAttitude;
        acc.communication += review.criteria.communication;
        acc.ruleCompliance += review.criteria.ruleCompliance;
        acc.initiative += review.criteria.initiative;
        return acc;
      },
      {
        technicalQuality: 0,
        professionalAttitude: 0,
        communication: 0,
        ruleCompliance: 0,
        initiative: 0,
      }
    );
    
    const count = userReviews.length;
    return {
      technicalQuality: Math.round((sum.technicalQuality / count) * 10) / 10,
      professionalAttitude: Math.round((sum.professionalAttitude / count) * 10) / 10,
      communication: Math.round((sum.communication / count) * 10) / 10,
      ruleCompliance: Math.round((sum.ruleCompliance / count) * 10) / 10,
      initiative: Math.round((sum.initiative / count) * 10) / 10,
      overall: Math.round(
        ((sum.technicalQuality + sum.professionalAttitude + sum.communication + sum.ruleCompliance + sum.initiative) / (count * 5)) * 10
      ) / 10,
    };
  };
  
  // Initialize new review state
  const [newReview, setNewReview] = useState({
    revieweeId: "",
    reviewDate: format(new Date(), "yyyy-MM-dd"),
    criteria: {
      technicalQuality: 3 as ReviewCriteriaScore,
      professionalAttitude: 3 as ReviewCriteriaScore,
      communication: 3 as ReviewCriteriaScore,
      ruleCompliance: 3 as ReviewCriteriaScore,
      initiative: 3 as ReviewCriteriaScore,
    },
    strengths: "",
    areasToImprove: "",
  });
  
  // Helper to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon 
            key={star} 
            className={`h-4 w-4 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-2 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  const handleCreateReview = () => {
    const reviewee = reviewableUsers.find(u => u.id === newReview.revieweeId);
    if (!reviewee) return;
    
    createReview({
      revieweeId: reviewee.id,
      revieweeName: reviewee.name,
      reviewDate: newReview.reviewDate,
      criteria: newReview.criteria,
      strengths: newReview.strengths || undefined,
      areasToImprove: newReview.areasToImprove || undefined,
    });
    
    setIsCreatingReview(false);
    // Reset form
    setNewReview({
      revieweeId: "",
      reviewDate: format(new Date(), "yyyy-MM-dd"),
      criteria: {
        technicalQuality: 3,
        professionalAttitude: 3,
        communication: 3,
        ruleCompliance: 3,
        initiative: 3,
      },
      strengths: "",
      areasToImprove: "",
    });
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đánh giá nhân sự</h1>
          <p className="text-muted-foreground">Đánh giá chất lượng công việc của nhân viên outsource</p>
        </div>
        <Button onClick={() => setIsCreatingReview(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Tạo đánh giá mới
        </Button>
      </div>
      
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên nhân viên..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Tổng quan</TabsTrigger>
          <TabsTrigger value="timeline">Dòng thời gian</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          {Object.keys(reviewsByUser).length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(reviewsByUser).map(([userId, userReviews]) => {
                const averageScores = getAverageScores(userReviews);
                if (!averageScores) return null;
                
                const latestReview = userReviews[0];
                
                return (
                  <Card key={userId} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        {latestReview.revieweeName}
                      </CardTitle>
                      <CardDescription>
                        {userReviews.length} đánh giá, cập nhật gần nhất: {format(new Date(latestReview.reviewDate), "dd/MM/yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Đánh giá tổng thể:</span>
                          {renderStars(averageScores.overall)}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Chất lượng kỹ thuật:</span>
                            {renderStars(averageScores.technicalQuality)}
                          </div>
                          <div className="flex justify-between">
                            <span>Thái độ chuyên nghiệp:</span>
                            {renderStars(averageScores.professionalAttitude)}
                          </div>
                          <div className="flex justify-between">
                            <span>Giao tiếp:</span>
                            {renderStars(averageScores.communication)}
                          </div>
                          <div className="flex justify-between">
                            <span>Tuân thủ quy định:</span>
                            {renderStars(averageScores.ruleCompliance)}
                          </div>
                          <div className="flex justify-between">
                            <span>Chủ động &amp; Trách nhiệm:</span>
                            {renderStars(averageScores.initiative)}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => navigate(`/reviews/${userId}`)}
                      >
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <StarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Chưa có đánh giá nào</h3>
              <p className="text-muted-foreground mt-2">
                Tạo đánh giá nhân viên mới để quản lý chất lượng công việc
              </p>
              <Button className="mt-4" onClick={() => setIsCreatingReview(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Tạo đánh giá mới
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="timeline">
          {filteredReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <UserIcon className="h-5 w-5" />
                          {review.revieweeName}
                        </CardTitle>
                        <CardDescription>
                          Đánh giá bởi: {review.reviewerName} vào ngày {format(new Date(review.reviewDate), "dd/MM/yyyy")}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium">Tổng thể:</span>
                        {renderStars(
                          (review.criteria.technicalQuality + 
                           review.criteria.professionalAttitude + 
                           review.criteria.communication + 
                           review.criteria.ruleCompliance + 
                           review.criteria.initiative) / 5
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Tiêu chí đánh giá</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Chất lượng kỹ thuật:</span>
                            {renderStars(review.criteria.technicalQuality)}
                          </div>
                          <div className="flex justify-between">
                            <span>Thái độ chuyên nghiệp:</span>
                            {renderStars(review.criteria.professionalAttitude)}
                          </div>
                          <div className="flex justify-between">
                            <span>Giao tiếp:</span>
                            {renderStars(review.criteria.communication)}
                          </div>
                          <div className="flex justify-between">
                            <span>Tuân thủ quy định:</span>
                            {renderStars(review.criteria.ruleCompliance)}
                          </div>
                          <div className="flex justify-between">
                            <span>Chủ động &amp; Trách nhiệm:</span>
                            {renderStars(review.criteria.initiative)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {review.strengths && (
                          <div>
                            <h4 className="font-medium text-sm">Điểm mạnh</h4>
                            <p className="text-sm text-muted-foreground">{review.strengths}</p>
                          </div>
                        )}
                        {review.areasToImprove && (
                          <div>
                            <h4 className="font-medium text-sm">Cần cải thiện</h4>
                            <p className="text-sm text-muted-foreground">{review.areasToImprove}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <StarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Không tìm thấy đánh giá nào</h3>
              <p className="text-muted-foreground mt-2">
                Thử tìm kiếm với từ khóa khác hoặc tạo đánh giá mới
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Review Dialog */}
      <Dialog open={isCreatingReview} onOpenChange={setIsCreatingReview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo đánh giá mới</DialogTitle>
            <DialogDescription>
              Đánh giá chất lượng công việc của nhân viên outsource
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reviewee">Người được đánh giá</Label>
                <Select
                  value={newReview.revieweeId}
                  onValueChange={(value) => setNewReview({...newReview, revieweeId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reviewDate">Ngày đánh giá</Label>
                <Input
                  id="reviewDate"
                  type="date"
                  value={newReview.reviewDate}
                  onChange={(e) => setNewReview({...newReview, reviewDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Tiêu chí đánh giá</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Chất lượng kỹ thuật</Label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => setNewReview({
                            ...newReview,
                            criteria: {
                              ...newReview.criteria,
                              technicalQuality: rating as ReviewCriteriaScore
                            }
                          })}
                        >
                          <StarIcon 
                            className={`h-5 w-5 ${rating <= newReview.criteria.technicalQuality ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Label>Thái độ chuyên nghiệp</Label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => setNewReview({
                            ...newReview,
                            criteria: {
                              ...newReview.criteria,
                              professionalAttitude: rating as ReviewCriteriaScore
                            }
                          })}
                        >
                          <StarIcon 
                            className={`h-5 w-5 ${rating <= newReview.criteria.professionalAttitude ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Label>Giao tiếp</Label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => setNewReview({
                            ...newReview,
                            criteria: {
                              ...newReview.criteria,
                              communication: rating as ReviewCriteriaScore
                            }
                          })}
                        >
                          <StarIcon 
                            className={`h-5 w-5 ${rating <= newReview.criteria.communication ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Label>Tuân thủ quy định</Label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => setNewReview({
                            ...newReview,
                            criteria: {
                              ...newReview.criteria,
                              ruleCompliance: rating as ReviewCriteriaScore
                            }
                          })}
                        >
                          <StarIcon 
                            className={`h-5 w-5 ${rating <= newReview.criteria.ruleCompliance ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Label>Chủ động &amp; Trách nhiệm</Label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => setNewReview({
                            ...newReview,
                            criteria: {
                              ...newReview.criteria,
                              initiative: rating as ReviewCriteriaScore
                            }
                          })}
                        >
                          <StarIcon 
                            className={`h-5 w-5 ${rating <= newReview.criteria.initiative ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strengths">Điểm mạnh</Label>
                <Textarea
                  id="strengths"
                  placeholder="Nhập điểm mạnh của nhân viên..."
                  value={newReview.strengths}
                  onChange={(e) => setNewReview({...newReview, strengths: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="areasToImprove">Lĩnh vực cần cải thiện</Label>
                <Textarea
                  id="areasToImprove"
                  placeholder="Nhập lĩnh vực cần cải thiện..."
                  value={newReview.areasToImprove}
                  onChange={(e) => setNewReview({...newReview, areasToImprove: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingReview(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateReview} disabled={!newReview.revieweeId}>
              Tạo đánh giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OutsourceReviewPage;
