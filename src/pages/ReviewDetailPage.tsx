
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeftIcon, StarIcon, UserIcon } from "lucide-react";

const ReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reviews, users } = useApp();
  
  // Get user information
  const userReviews = reviews.filter(review => review.revieweeId === id);
  
  if (userReviews.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy đánh giá</h1>
        <p className="text-muted-foreground mb-6">Không có đánh giá nào cho người dùng này.</p>
        <Button onClick={() => navigate("/reviews")}>Quay lại danh sách đánh giá</Button>
      </div>
    );
  }
  
  // Sort reviews by date (newest first)
  const sortedReviews = [...userReviews].sort((a, b) => 
    new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
  );
  
  const userName = sortedReviews[0].revieweeName;
  
  // Calculate average scores
  const getAverageScores = () => {
    const sum = sortedReviews.reduce(
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
    
    const count = sortedReviews.length;
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
  
  const averageScores = getAverageScores();
  
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

  return (
    <div className="container py-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/reviews")}
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Quay lại danh sách đánh giá
      </Button>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <UserIcon className="h-7 w-7" />
          {userName}
        </h1>
        <p className="text-muted-foreground">
          {sortedReviews.length} đánh giá, cập nhật gần nhất: {format(new Date(sortedReviews[0].reviewDate), "dd/MM/yyyy")}
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Tổng quan đánh giá</CardTitle>
            <CardDescription>Trung bình từ {sortedReviews.length} đánh giá</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-6">
              <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="text-3xl font-bold mb-2">{averageScores.overall.toFixed(1)}</div>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon 
                      key={star} 
                      className={`h-6 w-6 ${star <= averageScores.overall ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Tổng thể</div>
              </div>
              
              <div className="col-span-1 md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">Chất lượng kỹ thuật</div>
                  {renderStars(averageScores.technicalQuality)}
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">Thái độ chuyên nghiệp</div>
                  {renderStars(averageScores.professionalAttitude)}
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">Giao tiếp</div>
                  {renderStars(averageScores.communication)}
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">Tuân thủ quy định</div>
                  {renderStars(averageScores.ruleCompliance)}
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">Chủ động &amp; Trách nhiệm</div>
                  {renderStars(averageScores.initiative)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Lịch sử đánh giá</h2>
      
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  Đánh giá vào ngày {format(new Date(review.reviewDate), "dd/MM/yyyy")}
                </CardTitle>
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
              <CardDescription>Đánh giá bởi: {review.reviewerName}</CardDescription>
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
    </div>
  );
};

export default ReviewDetailPage;
