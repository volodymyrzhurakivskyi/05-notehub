import ReactPaginateImport from 'react-paginate';
import css from './Pagination.module.css';

type ReactPaginateComponent = typeof ReactPaginateImport;

const ReactPaginate = (
  (ReactPaginateImport as unknown as { default?: ReactPaginateComponent }).default
  ?? ReactPaginateImport
);

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

function Pagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      containerClassName={css.pagination}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      forcePage={forcePage}
    />
  );
}

export default Pagination;