import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (!process.env.NEXTJS_REVALIDATE_SECRET || secret !== process.env.NEXTJS_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, slug, oldSlug, categorySlug } = body as {
      type: string;
      slug?: string;
      oldSlug?: string;
      categorySlug?: string;
    };

    switch (type) {
      case 'article':
        revalidatePath('/articles');
        if (slug) revalidatePath(`/articles/${slug}`);
        if (oldSlug) revalidatePath(`/articles/${oldSlug}`);
        if (categorySlug) revalidatePath(`/articles/category/${categorySlug}`);
        revalidatePath('/');
        revalidatePath('/sitemap.xml');
        break;
      case 'product':
        revalidatePath('/products');
        if (slug) revalidatePath(`/products/${slug}`);
        if (oldSlug) revalidatePath(`/products/${oldSlug}`);
        if (categorySlug) revalidatePath(`/products/category/${categorySlug}`);
        revalidatePath('/');
        revalidatePath('/sitemap.xml');
        break;
      case 'article-category':
        revalidatePath('/articles');
        if (slug) revalidatePath(`/articles/category/${slug}`);
        if (oldSlug) revalidatePath(`/articles/category/${oldSlug}`);
        revalidatePath('/sitemap.xml');
        break;
      case 'product-category':
        revalidatePath('/products');
        if (slug) revalidatePath(`/products/category/${slug}`);
        if (oldSlug) revalidatePath(`/products/category/${oldSlug}`);
        revalidatePath('/sitemap.xml');
        break;
      default:
        revalidatePath('/');
        revalidatePath('/sitemap.xml');
    }

    return NextResponse.json({
      revalidated: true,
      type,
      slug,
      oldSlug,
      categorySlug,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
