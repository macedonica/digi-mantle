<?php
/**
 * Cache Warmer Script
 * 
 * This script warms the Cloudflare cache for PDF files stored in library_storage.
 * Upload this file to: public_html/warm_cache.php
 * 
 * Usage: https://bibliothecamacedonica.com/warm_cache.php?file=filename.pdf
 * 
 * @author Bibliotheca Macedonica
 */

// Configuration
$base_url = 'https://bibliothecamacedonica.com/library_storage';
$timeout = 5; // Seconds - just enough to trigger the download
$allowed_extensions = ['pdf'];

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Response helper
function respond($success, $message, $data = []) {
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ], $data));
    exit();
}

// Get and validate the file parameter
$file = isset($_GET['file']) ? $_GET['file'] : '';

if (empty($file)) {
    respond(false, 'Missing file parameter. Usage: ?file=filename.pdf');
}

// Security: Remove any path traversal attempts
$file = basename($file);
$file = str_replace(['../', '..\\', '/', '\\'], '', $file);

// Validate file extension
$extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
if (!in_array($extension, $allowed_extensions)) {
    respond(false, 'Invalid file extension. Only PDF files are allowed.', [
        'extension' => $extension,
        'allowed' => $allowed_extensions
    ]);
}

// Construct the full URL
$full_url = $base_url . '/' . urlencode($file);

// Initialize cURL
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $full_url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => $timeout,
    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_NOBODY => false, // We need to start downloading for cache to warm
    CURLOPT_USERAGENT => 'BibliothecaMacedonica-CacheWarmer/1.0',
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/pdf',
        'Cache-Control: no-cache' // Ensure we bypass any local cache
    ]
]);

// Execute the request
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
$download_size = curl_getinfo($ch, CURLINFO_SIZE_DOWNLOAD);

curl_close($ch);

// Check for errors
if ($curl_error && $http_code === 0) {
    // Timeout is expected - it means we triggered the download
    if (strpos($curl_error, 'timed out') !== false || strpos($curl_error, 'Timeout') !== false) {
        respond(true, 'Cache warming triggered successfully (timeout is expected for large files)', [
            'file' => $file,
            'url' => $full_url,
            'bytes_downloaded' => $download_size,
            'note' => 'Timeout after ' . $timeout . ' seconds is normal - cache warming has been initiated'
        ]);
    }
    respond(false, 'cURL error: ' . $curl_error, [
        'file' => $file,
        'url' => $full_url
    ]);
}

// Check HTTP response code
if ($http_code === 200) {
    respond(true, 'Cache warming completed successfully', [
        'file' => $file,
        'url' => $full_url,
        'http_code' => $http_code,
        'bytes_downloaded' => $download_size
    ]);
} elseif ($http_code === 404) {
    respond(false, 'File not found on server', [
        'file' => $file,
        'url' => $full_url,
        'http_code' => $http_code
    ]);
} else {
    respond(false, 'Unexpected HTTP response', [
        'file' => $file,
        'url' => $full_url,
        'http_code' => $http_code
    ]);
}
