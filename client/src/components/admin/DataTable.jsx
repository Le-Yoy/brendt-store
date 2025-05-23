// client/src/components/admin/DataTable.jsx

import React, { useState, useEffect } from 'react';
import styles from './DataTable.module.css';

const DataTable = ({ 
  columns,
  data,
  pagination = true,
  actions = [], 
  onRowClick,
  isLoading = false,
  emptyMessage = "Aucune donnée disponible",
  itemsPerPageOptions = [10, 25, 50, 100],
  defaultItemsPerPage = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filteredItems = [...data];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => {
        return columns.some(column => {
          const value = column.accessor(item);
          return value && value.toString().toLowerCase().includes(lowerCaseSearchTerm);
        });
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        const column = columns.find(col => col.id === sortConfig.key);
        if (!column) return 0;
        
        const valueA = column.accessor(a);
        const valueB = column.accessor(b);
        
        if (valueA === valueB) return 0;
        
        // Handle different types of values
        if (typeof valueA === 'string') {
          const comparison = valueA.localeCompare(valueB);
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        } else {
          const comparison = valueA < valueB ? -1 : 1;
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
      });
    }
    
    setFilteredData(filteredItems);
    setCurrentPage(1); // Reset to first page when data changes
  }, [data, searchTerm, sortConfig, columns]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const paginatedData = pagination 
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;

  const handleSort = (columnId) => {
    setSortConfig(prevSortConfig => {
      if (prevSortConfig.key === columnId) {
        return {
          key: columnId,
          direction: prevSortConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key: columnId, direction: 'asc' };
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Rechercher..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.searchIcon}>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {pagination && (
          <div className={styles.paginationSelect}>
            <span className={styles.paginationText}>Afficher</span>
            <select
              className={styles.selectPagination}
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span className={styles.paginationText}>entrées</span>
          </div>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr className={styles.tableHeadRow}>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`${styles.tableHeadCell} ${column.sortable !== false ? styles.sortableHeader : ''}`}
                  onClick={() => column.sortable !== false && handleSort(column.id)}
                  style={{ width: column.width || 'auto' }}
                >
                  <div className={styles.cellWithSort}>
                    <span>{column.header}</span>
                    {column.sortable !== false && (
                      <span className={`${styles.sortIcon} ${sortConfig.key !== column.id ? styles.sortIconHidden : ''}`}>
                        {sortConfig.key === column.id && sortConfig.direction === 'asc' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className={styles.tableHeadCell}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  className={`${styles.tableRow} ${onRowClick ? styles.clickableRow : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td 
                      key={`${row.id || rowIndex}-${column.id}`} 
                      className={styles.tableCell}
                    >
                      {column.cell ? column.cell(row) : column.accessor(row)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtonsContainer}>
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className={`${styles.actionButton} ${action.className || ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            disabled={action.isDisabled ? action.isDisabled(row) : false}
                            title={action.tooltip || action.name}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className={styles.emptyMessage}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>{' '}
            sur <span className="font-medium">{filteredData.length}</span> résultats
          </div>
          <div className={styles.paginationButtons}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
            >
              Premier
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
            >
              Précédent
            </button>
            
            <div className={styles.paginationNavigation}>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNumber;
                
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
                
                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`${styles.paginationButton} ${currentPage === pageNumber ? styles.paginationButtonActive : ''}`}
                      style={{
                        backgroundColor: currentPage === pageNumber ? 'var(--color-accent)' : '',
                        borderColor: currentPage === pageNumber ? 'var(--color-accent)' : '',
                      }}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
            >
              Suivant
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
            >
              Dernier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;