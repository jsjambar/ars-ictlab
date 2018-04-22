using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZXing.Net.Mobile;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using ZXing.Mobile;
using ZXing.Net.Mobile.Forms;

namespace App1
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class Overview : ContentPage
	{
		public Overview ()
		{
			InitializeComponent ();

            QRCodeScannerButton.Clicked += async (sender, e) => {
                //#if __ANDROID__
                //    MobileBarcodeScanner.Initialize(Application);
                //#endif

                //var scanner = new ZXing.Mobile.MobileBarcodeScanner();
                //var result = await scanner.Scan();

                //if (result != null) await DisplayAlert("Scanner result", $"Result of QR-scan: {result.Text}", "Okay");

                ZXingScannerPage scanPage = new ZXingScannerPage();

                scanPage.OnScanResult += (result) => {
                    scanPage.IsScanning = false;

                    Device.BeginInvokeOnMainThread(() => {
                        Navigation.PopModalAsync();
                        DisplayAlert("QR Code", $"Result: {result.Text}", "Okay");
                    });
                };

                await Navigation.PushModalAsync(scanPage);
            };
        }
	}
}