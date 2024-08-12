import React from 'react';

const NameInput = () => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">이름</label>
    <input
      type="text"
      placeholder="이름"
      className="w-full h-10 text-base border-0 rounded-lg outline-none px-3 bg-gray-200"
      required
    />
  </div>
);

export default NameInput;
