// File: functions/go/[[path]].js
export async function onRequestGet(context) {
  const { SHORTLINKS } = context.env; // Variabel dari binding
  const url = new URL(context.request.url);
  const key = url.searchParams.get('to');

  if (!key) return Response.redirect(url.origin, 302);
  
  const destinationUrl = await SHORTLINKS.get(key);

  if (destinationUrl) {
    return Response.redirect(destinationUrl, 301);
  } else {
    return Response.redirect(url.origin, 302);
  }
}
