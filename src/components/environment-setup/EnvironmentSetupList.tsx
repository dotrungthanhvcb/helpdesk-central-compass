
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Laptop,
  Monitor,
  Server,
  Smartphone,
  MapPin,
  Globe,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from 'react-router-dom';
import { useApp } from "@/contexts/AppContext";
import { EnvironmentSetup, DeviceType, SetupLocation } from '@/types';

type EnvironmentSetupListProps = {
  filter: 'all' | 'pending' | 'completed';
};

export const EnvironmentSetupList = ({ filter }: EnvironmentSetupListProps) => {
  const { environmentSetups } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter the setups based on the filter prop and search term
  const filteredSetups = environmentSetups.filter((setup) => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && setup.status !== 'resolved') ||
      (filter === 'completed' && setup.status === 'resolved');
      
    const matchesSearch = 
      setup.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (setup.responsibleName && setup.responsibleName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    return matchesFilter && (searchTerm === '' || matchesSearch);
  });
  
  // Helper function to render the device type icon
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'laptop':
        return <Laptop className="h-4 w-4" />;
      case 'pc':
        return <Monitor className="h-4 w-4" />;
      case 'vm':
        return <Server className="h-4 w-4" />;
      case 'byod':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };
  
  // Helper function to render the location icon
  const getLocationIcon = (location: SetupLocation) => {
    switch (location) {
      case 'onsite':
        return <MapPin className="h-4 w-4" />;
      case 'remote':
        return <Globe className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };
  
  // Helper function to calculate completion percentage
  const calculateProgress = (setup: EnvironmentSetup) => {
    if (!setup.items || setup.items.length === 0) return 0;
    
    const completedItems = setup.items.filter(item => item.status === 'done').length;
    return Math.round((completedItems / setup.items.length) * 100);
  };

  if (filteredSetups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Không tìm thấy yêu cầu thiết lập</h3>
        <p className="text-muted-foreground mt-2">
          {filter === 'all' 
            ? 'Chưa có yêu cầu thiết lập nào được tạo.' 
            : filter === 'pending' 
              ? 'Không có yêu cầu nào đang xử lý.' 
              : 'Không có yêu cầu nào đã hoàn thành.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-350px)]">
        <div className="space-y-4">
          {filteredSetups.map((setup) => (
            <Card key={setup.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{setup.employeeName}</h3>
                    <StatusBadge status={setup.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {getDeviceIcon(setup.deviceType)}
                      <span>{setup.deviceType === 'laptop' ? 'Laptop' : 
                             setup.deviceType === 'pc' ? 'PC' : 
                             setup.deviceType === 'vm' ? 'VM' : 'BYOD'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {getLocationIcon(setup.setupLocation)}
                      <span>{setup.setupLocation === 'onsite' ? 'Tại văn phòng' : 'Từ xa'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{setup.requestDate}</span>
                    </div>
                    
                    {setup.responsibleName && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{setup.responsibleName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Tiến độ thiết lập</span>
                      <span className="text-sm font-medium">{calculateProgress(setup)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${calculateProgress(setup)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {setup.items.map((item) => (
                      <Badge 
                        key={item.id}
                        variant={item.status === 'done' ? 'default' : 
                                item.status === 'blocked' ? 'destructive' : 
                                item.status === 'in_progress' ? 'secondary' : 'outline'}
                      >
                        {item.status === 'done' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {item.title.split(' ')[0]}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:justify-center items-start sm:items-end">
                  <Link to={`/environment-setup/${setup.id}`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Chi tiết <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
