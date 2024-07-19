import styled from 'styled-components'
type Props = {
  columns: {
    title: string;
    dataIndex: string;
    width?: number;
  }[];
  dataSource: {
    key: number;
    name: string;
    age: number;
    address: string;
  }[];
  pagination: {
    pageSize: number;
  };
  scroll: {
    y: number;
  };
}
export const Table = (props: Props) => {
  const { columns, dataSource: data, pagination, scroll } = props;
  let renderHeaderColumns = columns;
  if(scroll.y > 0) {
    renderHeaderColumns = [...columns, { title: '', dataIndex: 'operation', width: 15 }];
  }

  return (
   <StyledScrollContainer className='table-container'>
    <div className='table-header'>
    <table style={{ width: '100%'}}>
      <colgroup>
        {renderHeaderColumns.map(column => (
          <col key={column.dataIndex} style={{ width: column.width }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {renderHeaderColumns.map(column => (
            <th key={column.dataIndex}>{column.title}</th>
          ))}
        </tr>
      </thead>
    </table>
    <div className='table-body' style={{ height: scroll.y }}>
      <table style={{ width: '100%'}}>
        <colgroup>
          {columns.map(column => (
            <col key={column.dataIndex} style={{ width: column.width }} />
          ))}
        </colgroup>
        <tbody>
          {data.map(record => (
            <tr key={record.key}>
              {columns.map(column => (
                <td key={column.dataIndex}>{record[column.dataIndex]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>
   </StyledScrollContainer>
  );
}

const StyledScrollContainer = styled.div`
  width: 100%;

  table {
    table-layout: fixed;
    /* 隐藏表格边框 */
    border-collapse: collapse;
  }
  .table-body {
    overflow-y: scroll;
  }

  th, td {
    text-align: left;
    padding: 0;
  }
`