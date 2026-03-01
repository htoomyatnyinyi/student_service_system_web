import { useState } from "react";
import {
  useGetStudentFeesQuery,
  useCreateFeeMutation,
  useCreatePaymentMutation,
  useGetFeePaymentsQuery,
} from "../store/api/feesApi";
import { useGetStudentsQuery } from "../store/api/studentsApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { CreditCard, Plus, Receipt } from "lucide-react";
import type { Fee, Payment } from "../types";

export const FeesPage = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);

  const { data: studentsData } = useGetStudentsQuery({ limit: 100 });
  const { data: feesData, isLoading } = useGetStudentFeesQuery(
    selectedStudentId,
    { skip: !selectedStudentId },
  );
  const { data: paymentsData } = useGetFeePaymentsQuery(selectedFee?.id || "", {
    skip: !selectedFee,
  });

  const [createFee, { isLoading: isCreatingFee }] = useCreateFeeMutation();
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();

  const handleFeeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      studentId: selectedStudentId,
      type: formData.get("type") as string,
      amount: Number(formData.get("amount")),
      dueDate: new Date(formData.get("dueDate") as string).toISOString(),
      semester: Number(formData.get("semester")),
      year: Number(formData.get("year")),
    };
    await createFee(data);
    setIsFeeModalOpen(false);
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFee) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      feeId: selectedFee.id,
      amount: Number(formData.get("amount")),
      method: formData.get("method") as string,
    };
    await createPayment(data);
    setIsPaymentModalOpen(false);
  };

  const calculateAmountPaid = (feeId: string) => {
    // In a real app we'd get this from the API response or calculate it directly if embedded
    // For this UI, assume we have to view payment history to know exactly, or backend provides 'status'
    // We will just use 'status' from fee object here.
    return 0; // Placeholder
  };

  const columns = [
    {
      header: "Fee Type",
      accessor: (fee: Fee) => (
        <span className="font-semibold text-slate-800">{fee.type}</span>
      ),
    },
    {
      header: "Amount",
      accessor: (fee: Fee) => (
        <span className="font-mono text-slate-700">
          ${fee.amount.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Term",
      accessor: (fee: Fee) => (
        <span className="text-slate-600">
          Yr {fee.year} Sem {fee.semester}
        </span>
      ),
    },
    {
      header: "Due Date",
      accessor: (fee: Fee) => (
        <span className="text-red-600 font-medium">
          {new Date(fee.dueDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (fee: Fee) => (
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
            fee.status === "PAID"
              ? "bg-emerald-100 text-emerald-700"
              : fee.status === "PARTIAL"
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {fee.status || "UNPAID"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (fee: Fee) => (
        <button
          onClick={() => {
            setSelectedFee(fee);
            setIsPaymentModalOpen(true);
          }}
          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-lg text-sm transition-colors"
          disabled={fee.status === "PAID"}
        >
          {fee.status === "PAID" ? "Settled" : "Add Payment"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Fees & Payments
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage student financial accounts, tuition, and payments.
          </p>
        </div>
        <button
          onClick={() => setIsFeeModalOpen(true)}
          disabled={!selectedStudentId}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Receipt className="w-5 h-5 mr-2" />
          Bill New Fee
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Student Account Selector
        </label>
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">-- Choose a student account --</option>
          {studentsData?.data.map((student) => (
            <option key={student.id} value={student.id}>
              {student.studentId}
            </option>
          ))}
        </select>
      </div>

      {selectedStudentId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-slate-700">
                Account Statement
              </h3>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={feesData?.data || []}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 border-dashed text-slate-500">
          <CreditCard className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-lg font-medium text-slate-600">
            Select Student Account
          </p>
          <p className="text-sm mt-1">
            Please select a student above to view their financial statement.
          </p>
        </div>
      )}

      {/* Bill New Fee Modal */}
      <Modal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        title="Issue New Fee / Invoice"
      >
        <form onSubmit={handleFeeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Fee Description / Type
            </label>
            <input
              name="type"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Tuition Fee, Library Fine"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="amount"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Academic Year
              </label>
              <input
                type="number"
                name="year"
                defaultValue={new Date().getFullYear()}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Semester
              </label>
              <input
                type="number"
                name="semester"
                defaultValue={1}
                min="1"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsFeeModalOpen(false)}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingFee}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              Bill Student
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Payment"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold">{selectedFee?.type}</div>
              <div className="text-xs text-blue-600/80">
                Total Due: ${selectedFee?.amount.toFixed(2)}
              </div>
            </div>
            <div className="text-xl font-bold font-mono">
              ${selectedFee?.amount.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Payment Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              defaultValue={selectedFee?.amount}
              required
              max={selectedFee?.amount}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-mono font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Payment Method
            </label>
            <select
              name="method"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CARD">Credit/Debit Card</option>
              <option value="MOBILE_PAYMENT">
                Mobile Payment (PromptPay/PayNow/etc)
              </option>
            </select>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingPayment}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-emerald-500/20"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
