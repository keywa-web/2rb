// File: functions/go/[[path]].js

export async function onRequestGet(context) {
  // context.env.SHORTLINKS adalah cara mengakses KV namespace
  const { SHORTLINKS } = context.env;
  
  const url = new URL(context.request.url);
  const key = url.searchParams.get('to');

  if (!key) {
    return Response.redirect(url.origin, 302);
  }

  // Ambil URL tujuan dari KV berdasarkan 'key'
  const destinationUrl = await SHORTLINKS.get(key);

  if (destinationUrl) {
    console.log(`Redirecting '${key}' to '${destinationUrl}'`);
    return Response.redirect(destinationUrl, 301);
  } else {
    console.warn(`Shortlink key '${key}' not found in KV.`);
    return Response.redirect(url.origin, 302);
  }
}
