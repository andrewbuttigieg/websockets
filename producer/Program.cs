using System;
using System.Threading;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace producer
{
    class Program
    {
        private static readonly AutoResetEvent closing = new AutoResetEvent(false);
        private static WebSocketServer webSocketServer = null;
        
        static void Main(string[] args)
        {
            webSocketServer = new WebSocketServer (8080, false);
            webSocketServer.AddWebSocketService<Laputa> ("/Laputa");
            webSocketServer.WaitTime = TimeSpan.FromMinutes(5);
            webSocketServer.Start ();

             Task.Factory.StartNew(() => {
              while (true)
              {
                Console.WriteLine(DateTime.Now.ToString());
                Thread.Sleep(1000 * 60);
              }
            });
            Console.CancelKeyPress += new ConsoleCancelEventHandler(OnExit);
            closing.WaitOne();
        }

        protected static void OnExit(object sender, ConsoleCancelEventArgs args)
        {
          Console.WriteLine("Exit");
          closing.Set();
          webSocketServer.Stop ();
        }
    }

    public class Laputa : WebSocketBehavior
  {
    protected override void OnMessage (MessageEventArgs e)
    {
      var msg = e.Data == "BALUS"
                ? "I've been balused already..."
                : e.Data;
      Console.WriteLine(msg);
      Send (msg);
    }
  }
}
