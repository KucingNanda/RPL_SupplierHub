import Swal from 'sweetalert2'

export const showPaymentGatewayModal = async (orderId, amount, onPaidCallback) => {
  const result = await Swal.fire({
    title: `<span class="text-xl font-black text-slate-800">Secure Payment</span>`,
    html: `
      <div class="mt-4 p-5 bg-slate-50 border border-slate-100 rounded-3xl text-left space-y-4">
        <div class="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed">
          <span class="text-slate-500 font-bold text-sm">Tagihan Pembayaran</span>
          <span class="text-2xl font-black text-indigo-600">Rp ${amount.toLocaleString('id-ID')}</span>
        </div>
        <div class="space-y-3">
          <label class="flex items-center p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-500 transition-all">
            <input type="radio" name="paymentMethod" value="bca" class="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300">
            <span class="ml-3 font-bold text-slate-700">BCA Virtual Account</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" class="h-4 ml-auto opacity-70">
          </label>
          <label class="flex items-center p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-500 transition-all">
            <input type="radio" name="paymentMethod" value="qris" class="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300">
            <span class="ml-3 font-bold text-slate-700">QRIS</span>
            <span class="ml-auto text-xs font-black bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md">INSTANT</span>
          </label>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Bayar Sekarang',
    cancelButtonText: 'Batal',
    customClass: {
      popup: 'rounded-[2rem] shadow-2xl border border-slate-100',
      confirmButton: 'bg-indigo-600 rounded-xl px-8 py-3 font-bold text-white w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2',
      cancelButton: 'bg-slate-100 rounded-xl px-8 py-3 font-bold text-slate-600 w-full sm:w-auto',
      actions: 'flex flex-col sm:flex-row w-full px-5 pb-5'
    },
    preConfirm: () => {
      const selected = document.querySelector('input[name="paymentMethod"]:checked');
      if (!selected) {
        Swal.showValidationMessage('Silakan pilih metode pembayaran terlebih dahulu');
      }
      return selected?.value;
    }
  });

  if (result.isConfirmed) {
    Swal.fire({
      title: 'Memproses Pembayaran...',
      html: 'Menghubungkan ke server bank',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(async () => {
      await onPaidCallback();
    }, 1500);
  }
};

export const showLiveTrackingModal = (resi, timestamp) => {
  const t = new Date(timestamp);
  const now = new Date();
  const diffMs = now - t;
  
  const totalDurationMs = 2 * 60 * 60 * 1000;
  let progress = (diffMs / totalDurationMs) * 100;
  if (progress > 100) progress = 100;
  if (progress < 0) progress = 0;

  let currentStep = 1;
  let etaMsg = "";
  if (progress < 25) { currentStep = 1; etaMsg = "Menunggu Kurir"; }
  else if (progress < 50) { currentStep = 2; etaMsg = "Di Perjalanan ke Hub"; }
  else if (progress < 90) { currentStep = 3; etaMsg = "Menuju Toko Anda"; }
  else { currentStep = 4; etaMsg = "Paket Telah Tiba"; }

  const remainingMs = totalDurationMs - diffMs;
  let remainingText = "Sudah Sampai";
  if (remainingMs > 0) {
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    remainingText = `Estimasi tiba: ${hours}j ${mins}m lagi`;
  }

  Swal.fire({
    title: `<div class="text-left"><p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Live Tracking</p><p class="text-2xl font-black text-slate-800">${resi}</p></div>`,
    html: `
      <div class="mt-6 text-left">
        <div class="flex justify-between items-end mb-2">
          <div>
            <p class="text-sm font-bold text-slate-800">${etaMsg}</p>
            <p class="text-xs font-medium text-slate-500 mt-0.5">${remainingText}</p>
          </div>
          <span class="text-2xl font-black text-indigo-600">${Math.floor(progress)}%</span>
        </div>
        <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 relative overflow-hidden" style="width: ${progress}%">
            <div class="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
          </div>
        </div>

        <div class="mt-8 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${currentStep >= 1 ? '' : 'opacity-40 grayscale'}">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <i class="fas fa-box"></i>
            </div>
            <div class="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white border border-slate-100 shadow-sm ${currentStep === 1 ? 'ring-2 ring-indigo-500/20' : ''}">
              <h3 class="font-bold text-slate-800 text-sm">Pesanan Dikemas</h3>
              <p class="text-xs text-slate-500 mt-1">Gudang Supplier Hub</p>
            </div>
          </div>

          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${currentStep >= 2 ? '' : 'opacity-40 grayscale'}">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <i class="fas fa-truck-loading"></i>
            </div>
            <div class="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white border border-slate-100 shadow-sm ${currentStep === 2 ? 'ring-2 ring-indigo-500/20' : ''}">
              <h3 class="font-bold text-slate-800 text-sm">Diserahkan ke Kurir</h3>
              <p class="text-xs text-slate-500 mt-1">Armada Logistik B2B</p>
            </div>
          </div>

          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${currentStep >= 3 ? '' : 'opacity-40 grayscale'}">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <i class="fas fa-truck-fast"></i>
            </div>
            <div class="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white border border-slate-100 shadow-sm ${currentStep === 3 ? 'ring-2 ring-indigo-500/20' : ''}">
              <h3 class="font-bold text-slate-800 text-sm">Sedang Diantar</h3>
              <p class="text-xs text-slate-500 mt-1">Menuju Alamat Toko</p>
            </div>
          </div>

          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${currentStep >= 4 ? '' : 'opacity-40 grayscale'}">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${currentStep >= 4 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <i class="fas fa-check"></i>
            </div>
            <div class="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white border border-slate-100 shadow-sm ${currentStep === 4 ? 'ring-2 ring-green-500/20 bg-green-50/50' : ''}">
              <h3 class="font-bold text-slate-800 text-sm">Pesanan Diterima</h3>
              <p class="text-xs text-slate-500 mt-1">Telah sampai di Toko</p>
            </div>
          </div>
        </div>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: 'Tutup Tracker',
    customClass: {
      popup: 'rounded-[2rem] shadow-2xl border border-slate-100 max-w-lg w-full',
      confirmButton: 'w-full bg-slate-100 hover:bg-slate-200 rounded-xl px-6 py-3 font-bold text-slate-700 transition-all'
    }
  });
};
