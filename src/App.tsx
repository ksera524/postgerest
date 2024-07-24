import React, { useState, useMemo } from 'react';
import { Table } from "@yamada-ui/table"
import { Button, Input } from "@yamada-ui/react"

// APIから取得するデータの型を定義
type DataItem = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}

const App: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const columns = useMemo(() => {
    if (data.length === 0) return [];

    // データの最初のオブジェクトからカラムを生成
    const sampleItem = data[0];
    return Object.keys(sampleItem).map(key => ({
      header: key,  // データのキーをヘッダー名として使用
      accessorKey: key // データのキーをアクセサーキーとして使用
    }));
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const handleClick = async () => {
    try {
      const response = await fetch(`http://192.168.0.9/:30008/${search}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const result: DataItem[] = await response.json();
      setData(result);
      setError(null); // 成功時にエラーをリセット
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <h1>Data from PostgREST</h1>
      <Input placeholder="table name" value={search} onChange={handleChange} />
      <Button colorScheme="primary" variant="solid" onClick={handleClick}>Fetch Data</Button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <Table columns={columns} data={data} />
    </div>
  );
};

export default App;
