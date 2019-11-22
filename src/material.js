import React from 'react';
import MaterialTable from 'material-table';
import { useState, useEffect } from 'react';
import axios from 'axios';

const host = ''
const url = host + '/serviceinfo';
const addUrl = host + '/serviceinfo/add';
const deleteUrl = host + '/serviceinfo/';
const updateUrl = host + '/serviceinfo/update';

const columns = [
    { title: 'ID', field: 'id', type: 'numeric' },
    { title: 'Name', field: 'server_name' },
    { title: 'HTTP', field: 'server_url' },
    { title: 'HTTPS', field: 'server_secure_url' },
    { title: 'Oprater', field: 'oprater' },
    { title: 'UpdateTime', field: 'update_time' },
    { title: 'AddTime', field: 'add_time' },
  ]

export default function MaterialTableDemo() {
  const [state, setState] = useState({
    columns: columns,
    data: [],
  });
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url, {mode: 'cors'});
      const json = await response.json();
      setState({
        columns: columns,
        data: json,
      });
    }
    fetchData();
  }, []);

  return (
    <MaterialTable
      title="^_^"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              axios.post(addUrl, JSON.stringify({
                server_name: newData.server_name,
                server_url: newData.server_url,
                server_secure_url: newData.server_secure_url,
                oprater: newData.oprater,
                server_api: newData.server_api,
              }))
              .then(function (response) {
                console.log(response)
              })
              .catch(function (error) {
                console.log(error);
              });
              const data = [...state.data];
              data.unshift(newData);
              setState({ ...state, data });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              console.log(oldData.id)
              axios.put(updateUrl, JSON.stringify({
                id: newData.id,
                server_name: newData.server_name,
                server_url: newData.server_url,
                server_secure_url: newData.server_secure_url,
                oprater: newData.oprater,
                server_api: newData.server_api,
              }))
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
              const data = [...state.data];
              data[data.indexOf(oldData)] = newData;
              setState({ ...state, data });
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const id = oldData.id
              axios.delete(deleteUrl + id)
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
              const data = [...state.data];
              data.splice(data.indexOf(oldData), 1);
              setState({ ...state, data });
            }, 600);
          }),
      }}
    />
  );
}
