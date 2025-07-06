import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Hangul from 'hangul-js';
import { apiGetWithToken } from '../../utils/Api';

const WikiSearch = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [autocompleteResults, setAutocompleteResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/wiki/${query.trim().replace(/ /g, '+')}`);
    }
  };

  const handleRandom = async () => {
    const response = await axios.get(import.meta.env.VITE_API_HOST + '/api/v1/wikis/random')
    const randomTitle = (response.data.data.title);
    navigate(`/wiki/${randomTitle}`); // 랜덤 페이지로 이동
  };

  useEffect(() => {
    const handleAutocomplete = async () => {
      const searchQuery = Hangul.disassemble(query.trim()).join("");

      if (searchQuery.length > 1) {
        try {
          const response = await apiGetWithToken(`/api/v1/wikis/autocomplete?input=${searchQuery}`, {
            params: { query: searchQuery }
          });
          setAutocompleteResults(response.data.data);
        } catch (error) {
          console.error('Autocomplete error:', error);
          setAutocompleteResults([]);
        }
      } else {
        setAutocompleteResults([]);
      }
    }
    handleAutocomplete();
  }, [query]);



  return (
    <div className="relative mb-6">
      <form onSubmit={handleSearch} className="max-w-lg mx-auto mt-6 ">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="flex-grow px-4 py-2 text-gray-700 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent rounded-l-md"
          />
          <button
            type="submit"
            className="h-full px-6 py-2 text-white bg-gray-600 rounded-r-none hover:bg-gray-700 focus:outline-none"
          >
            검색
          </button>
          <button
            type="button"
            onClick={handleRandom}
            className="h-full px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none rounded-r-md"
          >
            랜덤
          </button>
        </div>
      </form>
      {autocompleteResults.length > 0 && (
        <ul className="absolute z-10 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border border-gray-300 rounded-md shadow-lg mx-auto overflow-y-auto">
          {autocompleteResults.map((result, index) => (
            <li
              key={index}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(result.title);
                setAutocompleteResults([]);
                navigate(`/wiki/${result.title}`);
              }}
            >
              {result.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WikiSearch;
