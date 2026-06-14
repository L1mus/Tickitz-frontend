import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  getPaymentPage,
  submitPayment,
  openModal,
  closeModal,
  confirmPayment,
} from '../redux/slices/transactionSlice';
import Stepper from '../components/molecules/Stepper';
import PaymentModal from '../components/organism/PaymentModal';

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const ASSET_URL = 'http://localhost:8080';

  const [selectedMethodId, setSelectedMethodId] = useState(null);

  const {
    paymentPage,
    modal,
    loading: pageLoading,
  } = useSelector((state) => state.transaction);

  const paymentData = paymentPage?.data || {};

  useEffect(() => {
    if (bookingId) {
      dispatch(getPaymentPage(bookingId))
        .unwrap()
        .catch(() => {
          toast.error('Failed to load payment details.');
        });
    }
  }, [bookingId, dispatch]);

  const handlePayTicket = async () => {
    if (!selectedMethodId) {
      toast.error('Please select a payment method first!', {
        position: 'top-center',
      });
      return;
    }

    await toast.promise(
      dispatch(
        submitPayment({
          bookingId: parseInt(bookingId, 10),
          paymentMethodId: selectedMethodId,
        })
      ).unwrap(),
      {
        loading: 'Processing your payment request...',
        success: () => {
          dispatch(openModal());
          return 'Payment request generated successfully!';
        },
        error: (err) => err?.message || 'Failed to submit payment.',
      }
    );
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F6F8]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const displayDate = paymentData.show_date ?
     new Date(paymentData.show_date).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  ) : '';

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] px-4 py-10 font-sans text-gray-800 antialiased md:px-0">
      <div className="mx-auto max-w-175">
        <div className="mx-auto mb-10 w-full max-w-md">
          <Stepper
            steps={['Dates And Time', 'Seat', 'Payment']}
            activeStep={2}
            showCheck={true}
          />
        </div>

        <div className="rounded-xl bg-white p-8 shadow-sm md:p-12">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Payment Info</h2>
          <div className="flex flex-col gap-5">
            <div className="border-b border-gray-200 pb-3">
              <p className="mb-1 text-xs tracking-wider text-gray-400 uppercase">
                Date & Time
              </p>
              <p className="text-base text-gray-900">
                {displayDate} at {paymentData.show_time}
              </p>
            </div>
            <div className="border-b border-gray-200 pb-3">
              <p className="mb-1 text-xs tracking-wider text-gray-400 uppercase">
                Movie Title
              </p>
              <p className="text-base text-gray-900">
                {paymentData?.movie_title}
              </p>
            </div>
            <div className="border-b border-gray-200 pb-3">
              <p className="mb-1 text-xs tracking-wider text-gray-400 uppercase">
                Cinema Name
              </p>
              <p className="text-base text-gray-900">
                {paymentData?.cinema_name}
              </p>
            </div>
            <div className="border-b border-gray-200 pb-3">
              <p className="mb-1 text-xs tracking-wider text-gray-400 uppercase">
                Number of Tickets
              </p>
              <p className="text-base text-gray-900">
                <span>{paymentData.quantity} </span>
                pieces
              </p>
            </div>
            <div className="border-b border-gray-200 pb-3">
              <p className="mb-1 text-xs tracking-wider text-gray-400 uppercase">
                Total Payment
              </p>
              <p className="text-xl font-bold text-blue-600">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(paymentData?.total_price)}
              </p>
            </div>
          </div>

          <h2 className="mt-10 mb-6 text-xl font-bold text-gray-900">
            Personal Information
          </h2>
          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm text-gray-500">
                Full Name
              </label>
              <input
                type="text"
                disabled
                value={paymentData?.full_name}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-500">Email</label>
              <input
                type="email"
                disabled
                value={paymentData?.email}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-500">
                Phone Number
              </label>
              <div className="flex items-center overflow-hidden rounded-md border border-gray-300 bg-white">
                <input
                  type="text"
                  disabled
                  value={paymentData?.phone}
                  className="w-full bg-white px-4 py-3 text-base text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <h2 className="mt-10 mb-6 text-xl font-bold text-gray-900">
            Payment Method
          </h2>
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {paymentData.payment_methods?.map((method) => {
              const isSelected = selectedMethodId === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethodId(method.id)}
                  className={`flex h-16 items-center justify-center rounded-md border transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <img
                    src={`${ASSET_URL}${method.logo}`}
                    alt={method.name}
                    className="max-h-6 max-w-full object-contain"
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={handlePayTicket}
            className="w-full rounded-md bg-blue-700 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Pay your order
          </button>
        </div>
      </div>
      <PaymentModal
        isOpen={modal.isOpen}
        virtualRek={modal.data?.virtual_rek || '-'}
        totalPrice={modal.data?.total_price || paymentData.total_price}
        paymentDeadline={new Date(paymentData.show_date).toLocaleDateString(
          'en-US',
          {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        )}
        onClose={() => dispatch(closeModal())}
        onPayLater={() => {
          dispatch(closeModal());
          toast.success('Saved to pay later.');
          navigate('/');
        }}
        onCheckPayment={async () => {
          if (modal.data?.transaction_id) {
            toast.loading('Checking payment status...', {
              id: 'confirm-payment',
            });

            try {
              await dispatch(
                confirmPayment({
                  transactionId: modal.data.transaction_id,
                  bookingId: parseInt(bookingId, 10),
                })
              ).unwrap();

              toast.success('Payment Confirmed!', { id: 'confirm-payment' });
              dispatch(closeModal());
              navigate(`/users/result/${modal.data.transaction_id}`);
            } catch (error) {
              toast.error(error || 'Payment confirmation failed', {
                id: 'confirm-payment',
              });
            }
          } else {
            toast.error('Transaction ID not found.');
          }
        }}
      />
    </div>
  );
};

export default Payment;
