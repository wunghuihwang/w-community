import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalCount: number;
    limit: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

export const Pagination = ({ currentPage, totalCount, limit, onPageChange, maxVisiblePages = 5 }: PaginationProps) => {
    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalCount / limit);
    console.log(totalPages);
    // 표시할 페이지 번호 계산
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            // 전체 페이지가 최대 표시 개수보다 적으면 모두 표시
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 현재 페이지 기준으로 앞뒤 페이지 계산
            const halfVisible = Math.floor(maxVisiblePages / 2);
            let startPage = Math.max(1, currentPage - halfVisible);
            let endPage = Math.min(totalPages, currentPage + halfVisible);

            // 시작이나 끝 부분에서 균형 맞추기
            if (currentPage <= halfVisible) {
                endPage = Math.min(totalPages, maxVisiblePages);
            }
            if (currentPage > totalPages - halfVisible) {
                startPage = Math.max(1, totalPages - maxVisiblePages + 1);
            }

            // 첫 페이지 추가
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push('...');
                }
            }

            // 중간 페이지들 추가
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // 마지막 페이지 추가
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null; // 페이지가 1개 이하면 페이지네이션 숨김
    }

    return (
        <div className="mt-8 flex justify-center items-center gap-2">
            {/* 이전 버튼 */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-500'
                }`}
            >
                <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* 페이지 번호들 */}
            {visiblePages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                            ...
                        </span>
                    );
                }

                const pageNumber = page as number;
                const isActive = pageNumber === currentPage;

                return (
                    <motion.button
                        key={pageNumber}
                        whileHover={{ scale: isActive ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPageChange(pageNumber)}
                        className={`min-w-10 px-4 py-2 rounded-lg font-medium transition-colors ${
                            isActive
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-500'
                        }`}
                    >
                        {pageNumber}
                    </motion.button>
                );
            })}

            {/* 다음 버튼 */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-500'
                }`}
            >
                <ChevronRight className="w-5 h-5" />
            </motion.button>
        </div>
    );
};
