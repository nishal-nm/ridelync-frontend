import React from 'react';

const ConfirmModal = (props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full mx-4 text-center">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#1C160C] mb-3">
            {props.head}
          </h3>
          <p className="text-[#1C160C]/70">{props.que}</p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={props.closeModal}
            className="flex-1 px-6 py-2.5 text-sm font-medium text-[#1C160C] bg-[#F4EFE6] rounded-full hover:bg-[#E9E4DB] transition-colors"
          >
            {props.no}
          </button>
          <button
            onClick={props.confirm}
            className="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            {props.yes}
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = (props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full mx-4 text-center">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#1C160C] mb-3">
            {props.head}
          </h3>
          <p className="text-[#1C160C]/70">{props.message}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={props.closeModal}
            className="px-6 py-2.5 text-sm font-medium text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export { ConfirmModal, SuccessModal };
