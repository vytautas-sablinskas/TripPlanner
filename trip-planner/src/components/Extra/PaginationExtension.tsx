import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export function PaginationExtension({ totalPages, page, setCurrentPage }: any) {
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 4;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i}
              onClick={(event) => handlePageChange(event, i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={page === 1}
            onClick={(event) => handlePageChange(event, 1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > maxVisiblePages) {
        items.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i}
              onClick={(event) => handlePageChange(event, i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < totalPages - 1) {
        items.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={page === totalPages}
            onClick={(event) => handlePageChange(event, totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Pagination className="flex justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={
              page === 1 || totalPages === 0
                ? "pointer-events-none opacity-50"
                : undefined
            }
            onClick={(event) => handlePageChange(event, page - 1)}
          />
        </PaginationItem>
        {generatePaginationItems()}
        <PaginationItem>
          <PaginationNext
            href="#"
            className={
              page === totalPages || totalPages === 0
                ? "pointer-events-none opacity-50"
                : undefined
            }
            onClick={(event) => handlePageChange(event, page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
