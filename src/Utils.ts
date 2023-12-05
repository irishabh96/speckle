interface CommitReferencedObjectUrl {
  origin: string;
  streamId: string;
  commitId: string;
}

// Attention: got this reference of how to create object url from the viewer repository
export default class Utils {
  static async getObjectUrl(url: string): Promise<string> {
    let parsedUrl: any = new URL(url);
    const streamId = url.split('/streams/')[1].substring(0, 10);

    if (url.includes('commits')) {
      const commitId = url.split('/commits/')[1].substring(0, 10);
      const objUrl = await this.getCommitReferencedObjectUrl({
        origin: parsedUrl.origin,
        streamId,
        commitId,
      });
      parsedUrl = objUrl;
    }

    if (url.includes('objects')) parsedUrl = url;

    return parsedUrl;
  }

  private static async getCommitReferencedObjectUrl(ref: CommitReferencedObjectUrl) {
    const headers: { 'Content-Type': string; Authorization: string } = {
      'Content-Type': 'application/json',
      Authorization: '',
    };

    const res = await fetch(`${ref.origin}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `
          query Stream($streamId: String!, $commitId: String!) {
            stream(id: $streamId) {
              commit(id: $commitId) {
                referencedObject
              }
            }
          }
        `,
        variables: { streamId: ref.streamId, commitId: ref.commitId },
      }),
    });

    const { data } = await res.json();

    console.log({ data });

    return `${ref.origin}/streams/${ref.streamId}/objects/${data.stream.commit.referencedObject}`;
  }
}
