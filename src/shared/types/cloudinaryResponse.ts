export interface CloudinaryResponse {
	public_id: string;
	original_filename: string;
	resource_type: string;
	secure_url: string;
	bytes: number;
	asset_folder: string;
}

export interface CloudinaryTokenResponse {
  cloud_name: string;
  api_key: string;
  signature: string;
  upload_preset: string;
  timestamp: number;
}
