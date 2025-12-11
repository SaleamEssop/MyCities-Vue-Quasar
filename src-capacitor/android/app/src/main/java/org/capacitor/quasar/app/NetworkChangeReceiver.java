package org.capacitor.quasar.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;


public class NetworkChangeReceiver extends BroadcastReceiver {

  ConnectivityReceiverListener connectivityReceiverListener;

  public NetworkChangeReceiver(ConnectivityReceiverListener mConnectivityReceiverListener) {
    connectivityReceiverListener = mConnectivityReceiverListener;
  }

  @Override
  public void onReceive(final Context context, final Intent intent) {
    boolean status = isNetworkAvailable(context);
    if (connectivityReceiverListener != null) {
      connectivityReceiverListener.onNetworkConnectionChanged(status);
    }
//    showLog(context, status);
  }

  /*private void showLog(Context context, boolean status) {
    if (status) {
      Toast.makeText(context, "You're Online", Toast.LENGTH_LONG).show();
    } else {
      Toast.makeText(context, "You do not seem to have an internet connection. This app will not be able to upload and retrieve data.", Toast.LENGTH_LONG).show();
    }
  }*/

  private boolean isNetworkAvailable(Context context) {
    try {
      ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
      NetworkInfo activeNetworkInfo = cm.getActiveNetworkInfo();
      return (activeNetworkInfo != null && activeNetworkInfo.isConnectedOrConnecting());
    } catch (NullPointerException e) {
      return false;
    }
  }

}
