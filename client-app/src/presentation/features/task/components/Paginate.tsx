import clsx from "clsx";
import { FC } from "react";

interface Props {
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  prevPageDisabled: boolean;
  nextPageDisabled: boolean;
  count: number;
  page: number;
  per_page: number;
}

const Paginate: FC<Props> = (props) => {
  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-md p-4 text-sm transition-all duration-700 dark:bg-slate-800
      "
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700 transition-all duration-700 dark:text-slate-400">
          <span
            id="badge-dismiss-default"
            className="inline-flex items-center px-2 py-1 me-2 text-xs text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            Page{" "}
            <span className="pl-1 font-medium" data-testid="current-page">
              {props.page}
            </span>
          </span>
          <span className="px-1 text-xs font-extralight">Total</span>
          <span
            className="font-medium"
            data-testid="total-records"
            per-page={props.per_page}
          >
            {props.count}
          </span>{" "}
          <span className="text-xs font-extralight">records</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          className={clsx(
            "relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:bg-slate-50",
            props.prevPageDisabled && "cursor-not-allowed "
          )}
          onClick={props.goToPreviousPage}
          disabled={props.prevPageDisabled}
        >
          Previous
        </button>
        <button
          onClick={props.goToNextPage}
          className={clsx(
            "relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:bg-slate-100",
            props.nextPageDisabled && "cursor-not-allowed"
          )}
          disabled={props.nextPageDisabled}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Paginate;
