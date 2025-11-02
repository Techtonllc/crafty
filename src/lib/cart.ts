import { supabase, CartItem } from './supabase';

const SESSION_ID_KEY = 'crafty_session_id';

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

export async function addToCart(
  productId: string,
  quantity: number = 1,
  customizationText: string | null = null
): Promise<{ success: boolean; error?: string }> {
  const sessionId = getSessionId();

  try {
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .eq('customization_text', customizationText)
      .maybeSingle();

    if (existingItem) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert([{ session_id: sessionId, product_id: productId, quantity, customization_text: customizationText }]);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }
}

export async function getCartItems(): Promise<CartItem[]> {
  const sessionId = getSessionId();

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, error: 'Failed to update item' };
  }
}

export async function removeCartItem(itemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removing cart item:', error);
    return { success: false, error: 'Failed to remove item' };
  }
}

export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  const sessionId = getSessionId();

  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: 'Failed to clear cart' };
  }
}
