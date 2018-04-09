using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZXing.Net.Mobile;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using ZXing.Mobile;

namespace App1
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class Overview : ContentPage
	{
		public Overview ()
		{
			InitializeComponent ();

            QRCodeScannerButton.Click += (sender, e) => {
                #if __ANDROID__
                    MobileBarCodeScanner.Initialize(Application);
                #endif

                var scanner = new ZXing.Mobile.MobileBarcodeScanner();
                var result = await scanner.Scan();

                if (result != null) DisplayAlert("Scanner result", $"Result of QR-scan: {result.Text}", "Okay");
            };
        }
	}
}