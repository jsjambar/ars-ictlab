using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace App1
{
	public partial class MainPage : ContentPage
	{
		public MainPage()
		{
			InitializeComponent();
		}

        private void ValidateInput(object sender, EventArgs e)
        {
            this.ToggleLoginForm();
            this.ToggleLoginFeedbackForm();

            AnimationView.Play();

            AnimationView.OnFinish += (object s, EventArgs ev) =>
            {
                this.ToggleLoginForm();
                this.ToggleLoginFeedbackForm();
                Navigation.PushModalAsync(new Overview());
            };
        }

        private void ToggleLoginForm()
        {
            LoginForm.IsVisible = !LoginForm.IsVisible;
        }

        private void ToggleLoginFeedbackForm()
        {
            LoginFeedback.IsVisible = !LoginFeedback.IsVisible;
        }
	}
}
