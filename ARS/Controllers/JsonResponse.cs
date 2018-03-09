namespace ARS.Json
{
    public interface JsonResponse{
        string type {get;}
        string msg {get;}
    }

    public class JsonSuccess : JsonResponse{
        private string _msg;
        public JsonSuccess(string msg){_msg = msg;}

        public string type {
            get{return "Success";}
        }

        public string msg {
            get{return _msg;}
        }
    }

    public class JsonError : JsonResponse{
        private string _msg;
        public JsonError(string msg){_msg = msg;}

        public string type {
            get{return "Error";}
        }

        public string msg {
            get{return _msg;}
        }
    }
}