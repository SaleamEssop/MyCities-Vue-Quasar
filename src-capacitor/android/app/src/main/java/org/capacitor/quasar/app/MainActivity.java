package org.capacitor.quasar.app;

import android.content.BroadcastReceiver;
import android.content.DialogInterface;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.os.Build;
import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.plugin.Geolocation;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {

  AlertDialog.Builder builder;
  AlertDialog alertDialog;
  private BroadcastReceiver mNetworkReceiver;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    createDialog();
    mNetworkReceiver = new NetworkChangeReceiver(new ConnectivityReceiverListener() {

      @Override
      public void onNetworkConnectionChanged(boolean isConnected) {
        if (isConnected) {
          if (alertDialog.isShowing()) {
            recreate();
            alertDialog.dismiss();
          }
        } else {
          if (!alertDialog.isShowing()) {
            alertDialog.show();
          }
        }
      }
    });
    registerNetworkBroadcastForNougat();

    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(Geolocation.class);
    }});
  }

  private void registerNetworkBroadcastForNougat() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      registerReceiver(mNetworkReceiver, new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION));
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      registerReceiver(mNetworkReceiver, new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION));
    }
  }

  protected void unregisterNetworkChanges() {
    try {
      unregisterReceiver(mNetworkReceiver);
    } catch (IllegalArgumentException e) {
      e.printStackTrace();
    }
  }

  void createDialog() {
    builder = new AlertDialog.Builder(MainActivity.this, R.style.AlertDialogCustom);
    /*final View customLayout = getLayoutInflater().inflate(R.layout.custom_alert_dialog, null);
    builder.setView(customLayout);*/
    builder.setMessage("This app will close when you press “Okay” You can reopen the app when you have an internet connection.");
    builder.setTitle("No internet detected.");
    builder.setPositiveButton("Okay", new DialogInterface.OnClickListener() {
      @Override
      public void onClick(DialogInterface dialogInterface, int i) {
        if (alertDialog.isShowing()) {
          alertDialog.dismiss();
        }
        finishAndRemoveTask();
      }
    });
    builder.setCancelable(false);
    alertDialog = builder.create();
  }


  @Override
  public void onDestroy() {
    super.onDestroy();
    unregisterNetworkChanges();
  }
}
