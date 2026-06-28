package services

import (
	"supplierhub-api/repositories"
)

type StatsService struct{
	repo *repositories.StatsRepository
}

func NewStatsService() *StatsService {
	return &StatsService{
		repo: repositories.NewStatsRepository(),
	}
}

type AdminStats struct {
	TotalProducts   int64 `json:"total_products"`
	TotalOrders     int64 `json:"total_orders"`
	TotalRevenue    int64 `json:"total_revenue"`
	PendingRestocks int64 `json:"pending_restocks"`
}

type UMKMStats struct {
	TotalOrders  int64 `json:"total_orders"`
	TotalBelanja int64 `json:"total_belanja"`
}

type DistributorStats struct {
	TotalPOMasuk    int64 `json:"total_po_masuk"`
	PendingRequests int64 `json:"pending_requests"`
}

func (s *StatsService) GetAdminStats() AdminStats {
	totalProducts := s.repo.CountProducts()
	totalOrders := s.repo.CountAllOrders()
	pendingRestocks := s.repo.CountPendingRestocks()

	var totalRevenue int64
	orders := s.repo.FindAllOrders()
	for _, o := range orders {
		if o.PaymentStatus == "Lunas" {
			totalRevenue += int64(o.TotalPrice)
		}
	}

	return AdminStats{
		TotalProducts:   totalProducts,
		TotalOrders:     totalOrders,
		TotalRevenue:    totalRevenue,
		PendingRestocks: pendingRestocks,
	}
}

func (s *StatsService) GetUMKMStats(userID int32) UMKMStats {
	totalOrders := s.repo.CountUserOrders(userID)
	
	var totalBelanja int64
	orders := s.repo.FindUserOrders(userID)
	for _, o := range orders {
		totalBelanja += int64(o.TotalPrice)
	}

	return UMKMStats{
		TotalOrders:  totalOrders,
		TotalBelanja: totalBelanja,
	}
}

func (s *StatsService) GetDistributorStats(userID int32) DistributorStats {
	return DistributorStats{
		TotalPOMasuk:    s.repo.CountDistributorRestocks(userID),
		PendingRequests: s.repo.CountPendingDistributorRestocks(userID),
	}
}
