import { maildiver } from './maildiver';

const PORT = process.env.PORT || 3000;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const { method } = req;
    const { pathname } = new URL(req.url);

    if (method === 'POST' && pathname === '/send-email') {
      try {
        const maildiverRes = await maildiver.email.send({
          to: 'sudo@example.com',
          from: 'you@example.com',
          subject: 'Email from the Maildiver Node.js SDK',
          html: '<p>Hi {{ firstName }}! Maildiver Node.js SDK is awesome!</p>',
          variables: {
            values: {
              firstName: 'Developer Name',
            },
            default_values: {
              fistName: 'there',
            },
          },
        });

        return new Response(JSON.stringify(maildiverRes), { status: 200 });
      } catch (err) {
        if (err instanceof Error) {
          return new Response(err.message, { status: 400 });
        }

        return new Response('Something went wrong!', { status: 500 });
      }
    }

    return new Response('Maildiver!');
  },
});

console.log(`Listening on http://localhost:${server.port}`);
