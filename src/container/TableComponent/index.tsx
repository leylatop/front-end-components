import React from 'react';
import { Table } from './Table';
import styled from 'styled-components'

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    // width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    // width: 150,
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: '',
    dataIndex: 'operation',
    width: 100
  }
];

// const data = [];
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: <StyledTd>
//       London, Park Lane no. ${i}
//     </StyledTd>,
//     operation: <a href='#'>Delete</a>
//   });
// }

export const TableComponent: React.FC = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: <StyledTd>
        <div className='left'>123</div>
        <div className='right'>
          <div>top</div>
          <div className='bottom'>
            London, Park Lane no. ${i}
          </div>
        </div>
        
      </StyledTd>,
      operation: <a href='#'>Delete</a>
    });
  }
  return (
    <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
  )
};


export const StyledTd = styled.div`
  display: flex;

  .left {
    flex-shrink: 0;
    width: 50px;
  }
  // 右侧部分占满剩余空间
  .right {
    /* flex: 1;
    flex-shrink */
    /* flex-grow: 1; */
    /* display: flex; */
    /* flex-direction: column; */
    max-width: calc(100% - 50px); // 限制最大宽度，防止溢出

    .bottom {
      // 底部文本溢出显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0; // 解决min-width: 0; 问题
    }
    
  }
`