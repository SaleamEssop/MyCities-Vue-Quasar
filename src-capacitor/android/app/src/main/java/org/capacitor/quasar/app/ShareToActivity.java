package org.capacitor.quasar.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class ShareToActivity extends AppCompatActivity {

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Uri data = getIntent().getData();

    if(data == null) {
      finish();
      return;
    }

    final String title = Uri.decode(data.getQueryParameter("title"));
    final String msg = Uri.decode(data.getQueryParameter("msg"));

    /*Create an ACTION_SEND Intent*/
    Intent intent = new Intent(android.content.Intent.ACTION_SEND);
    /*This will be the actual content you wish you share.*/
    /*The type of the content is text, obviously.*/
    intent.setType("text/plain");
    /*Applying information Subject and Body.*/
    intent.putExtra(android.content.Intent.EXTRA_SUBJECT, title);
    intent.putExtra(android.content.Intent.EXTRA_TEXT, msg);
    /*Fire!*/
    startActivity(Intent.createChooser(intent, "Share via"));

    finish();
  }


  @Override
  protected void onRestart() {
    super.onRestart();
  }

  @Override
  protected void onPostResume() {
    super.onPostResume();
    //finish();
  }
}
