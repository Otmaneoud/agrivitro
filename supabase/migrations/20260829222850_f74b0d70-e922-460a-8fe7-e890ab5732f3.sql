CREATE POLICY "Admins can upload content images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'content' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read content images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'content' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'content' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'content' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete content images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'content' AND public.has_role(auth.uid(), 'admin'));