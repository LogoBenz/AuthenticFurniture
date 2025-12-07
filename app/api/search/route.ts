        });

return NextResponse.json({ products });
    } catch (error) {
    console.error('❌ Search API Error:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
}
}
