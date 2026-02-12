<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style>
        @page {
            margin-top: {
                    {
                    $branding['margins']['top']
                }
            }

            mm;

            margin-bottom: {
                    {
                    $branding['margins']['bottom']
                }
            }

            mm;

            margin-left: {
                    {
                    $branding['margins']['left']
                }
            }

            mm;

            margin-right: {
                    {
                    $branding['margins']['right']
                }
            }

            mm;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .header-image {
            width: 100%;
            height: auto;
            position: fixed;

            top: - {
                    {
                    $branding['margins']['top']
                }
            }

            mm;

            left: - {
                    {
                    $branding['margins']['left']
                }
            }

            mm;
            z-index: -1;
        }

        .custom-header {
            position: fixed;

            top: - {
                    {
                    $branding['margins']['top']
                }
            }

            mm;
            left: 0;
            width: 100%;
        }

        .footer {
            position: fixed;
            bottom: -15mm;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #aaa;
        }

        .content {
            width: 100%;
        }

        /* Table Styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #eee;
        }

        th {
            background-color: #f9f9f9;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
        }

        .text-right {
            text-align: right;
        }

        .font-bold {
            font-weight: bold;
        }

        .mt-20 {
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <!-- Branding Assets (Images/Letterheads/Stamps) -->
    @foreach($branding['branding_assets'] as $asset)
    @if(isset($asset['base64']))
    <img src="{{ $asset['base64'] }}"
        style="position: fixed; 
                           top: {{ $asset['top'] }}mm; 
                           left: {{ $asset['left'] }}mm; 
                           width: {{ $asset['width'] ?? 50 }}mm; 
                           height: {{ $asset['height'] ?? 'auto' }};
                           opacity: {{ $asset['opacity'] ?? 1 }};
                           z-index: {{ $asset['z_index'] ?? -1 }};">
    @endif
    @endforeach

    <!-- Custom Header Image -->
    @if($branding['header_image'])
    <img src="{{ $branding['header_image'] }}" class="header-image">
    @endif

    <!-- Custom HTML Header -->
    @if($branding['header_html'])
    <div class="custom-header">
        {!! $branding['header_html'] !!}
    </div>
    @endif

    <div class="content">
        @include($content_view, $data)
    </div>

    <div class="footer">
        @if($branding['footer_html'])
        {!! $branding['footer_html'] !!}
        @else
        Page <span class="pagenum"></span> - {{ config('app.name') }}
        @endif
    </div>
</body>

</html>