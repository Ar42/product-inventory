import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface Props {
  lastPage: number;
  currentPageNo: number;
  onPageChange: (page: number) => void;
  containerClassName?: string;
}

const Pagination: React.FC<Props> = ({
  lastPage,
  currentPageNo,
  onPageChange,
  containerClassName = "",
}) => {
  const maxVisiblePages = 6;
  const [leftExpanded, setLeftExpanded] = useState(false);
  const [rightExpanded, setRightExpanded] = useState(false);
  const [leftOffset, setLeftOffset] = useState(0);
  const [rightOffset, setRightOffset] = useState(0);

  // Reset expansion states when current page changes
  useEffect(() => {
    setLeftExpanded(false);
    setRightExpanded(false);
    setLeftOffset(0);
    setRightOffset(0);
  }, [currentPageNo]);

  const generatePageNumbers = (): (
    | number
    | "left-ellipsis"
    | "right-ellipsis"
  )[] => {
    if (lastPage <= maxVisiblePages) {
      return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    const pages: (number | "left-ellipsis" | "right-ellipsis")[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Handle left expansion
    if (leftExpanded) {
      const startPage = 1 + leftOffset * halfVisible;
      const endPage = Math.min(startPage + maxVisiblePages - 1, lastPage);

      if (startPage > 1) {
        pages.push("left-ellipsis");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < lastPage) {
        pages.push("right-ellipsis");
      }

      return pages;
    }

    // Handle right expansion
    if (rightExpanded) {
      const endPage = lastPage - rightOffset * halfVisible;
      const startPage = Math.max(endPage - maxVisiblePages + 1, 1);

      if (startPage > 1) {
        pages.push("left-ellipsis");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < lastPage) {
        pages.push("right-ellipsis");
      }

      return pages;
    }

    // Default pagination logic
    if (currentPageNo <= 3) {
      pages.push(1, 2, 3);
      if (lastPage > 6) {
        pages.push("right-ellipsis");
      }
      pages.push(lastPage - 2, lastPage - 1, lastPage);
    } else if (currentPageNo >= lastPage - 2) {
      pages.push(1, 2, 3);
      if (lastPage > 6) {
        pages.push("left-ellipsis");
      }
      pages.push(lastPage - 2, lastPage - 1, lastPage);
    } else {
      pages.push(1);
      pages.push("left-ellipsis");
      pages.push(currentPageNo - 1, currentPageNo, currentPageNo + 1);
      pages.push("right-ellipsis");
      pages.push(lastPage);
    }

    return pages;
  };

  const handleLeftEllipsisClick = () => {
    if (!leftExpanded) {
      setLeftExpanded(true);
      setRightExpanded(false);
      setLeftOffset(0);
    } else {
      const newOffset = leftOffset + 1;
      const maxOffset = Math.floor(
        (lastPage - 1) / Math.floor(maxVisiblePages / 2)
      );

      if (newOffset > maxOffset) {
        setLeftExpanded(false);
        setLeftOffset(0);
      } else {
        setLeftOffset(newOffset);
      }
    }
  };

  const handleRightEllipsisClick = () => {
    if (!rightExpanded) {
      setRightExpanded(true);
      setLeftExpanded(false);
      setRightOffset(0);
    } else {
      const newOffset = rightOffset + 1;
      const maxOffset = Math.floor(
        (lastPage - 1) / Math.floor(maxVisiblePages / 2)
      );

      if (newOffset > maxOffset) {
        setRightExpanded(false);
        setRightOffset(0);
      } else {
        setRightOffset(newOffset);
      }
    }
  };

  const pageNumbers = generatePageNumbers();

  const handlePrevious = () => {
    if (currentPageNo > 1) {
      onPageChange(currentPageNo - 1);
    }
  };

  const handleNext = () => {
    if (currentPageNo < lastPage) {
      onPageChange(currentPageNo + 1);
    }
  };

  if (lastPage <= 1) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center space-x-1 ${containerClassName}`}
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPageNo === 1}
        className={`
          flex items-center justify-center cursor-pointer w-max px-2 py-1 text-xs rounded-sm border transition-colors
          ${
            currentPageNo === 1
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }
        `}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === "left-ellipsis") {
          return (
            <button
              key={`left-ellipsis-${index}`}
              onClick={handleLeftEllipsisClick}
              className="flex items-center justify-center cursor-pointer w-max px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-sm transition-colors"
              aria-label="Show more pages"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          );
        }

        if (page === "right-ellipsis") {
          return (
            <button
              key={`right-ellipsis-${index}`}
              onClick={handleRightEllipsisClick}
              className="flex items-center justify-center cursor-pointer w-max px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-sm transition-colors"
              aria-label="Show more pages"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          );
        }

        const isActive = page === currentPageNo;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`
              flex items-center justify-center cursor-pointer w-max px-2 py-1 text-sm rounded-sm border transition-colors font-medium
              ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }
            `}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPageNo === lastPage}
        className={`
          flex items-center justify-center cursor-pointer w-max px-2 py-1 text-xs rounded-sm border transition-colors
          ${
            currentPageNo === lastPage
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }
        `}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
