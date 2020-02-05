using System;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace producer
{
    class Program
    {
        static void Main(string[] args)
        {
            var wssv = new WebSocketServer (8080, false);
            wssv.AddWebSocketService<Laputa> ("/Laputa");
            wssv.Start ();
            Console.ReadKey (true);
            wssv.Stop ();
        }
    }

    public class Laputa : WebSocketBehavior
  {
    protected override void OnMessage (MessageEventArgs e)
    {
      var msg = e.Data == "BALUS"
                ? "I've been balused already..."
                : e.Data;

      Send (msg);
    }
  }
}
