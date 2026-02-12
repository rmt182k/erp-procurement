<div class="purchase-requisition">
    <table style="border: none;">
        <tr style="border: none;">
            <td style="border: none; width: 50%;">
                <p class="font-bold" style="margin: 0; font-size: 16px; color: {{ $branding['subtitle_color'] === '#64748b' ? '#000' : $branding['subtitle_color'] }}">{{ config('app.name') }}</p>
                <div style="margin-top: 5px; color: {{ $branding['subtitle_color'] }}; font-size: 11px;">
                    <p style="margin: 2px 0;">Request Date: <span style="font-weight: bold; color: {{ $branding['accent_color'] }};">{{ $pr->created_at->format('d M Y') }}</span></p>
                    <p style="margin: 2px 0;">Required Date: <span style="font-weight: bold; color: {{ $branding['accent_color'] }};">{{ $pr->required_date->format('d M Y') }}</span></p>
                    <p style="margin: 2px 0;">Status: <span style="text-transform: uppercase; font-weight: bold; color: {{ $branding['accent_color'] }};">{{ $pr->status }}</span></p>
                </div>
            </td>
            <td style="border: none; width: 50%; text-align: right; vertical-align: top;">
                <h1 style="color: {{ $branding['title_color'] }}; margin: 0; text-transform: uppercase; font-size: 28px; line-height: 1; letter-spacing: -1px;">
                    {{ $branding['title_text'] }}
                </h1>
                <p style="color: {{ $branding['subtitle_color'] }}; font-family: monospace; font-size: 12px; margin-top: 5px; opacity: 0.8;">DOC NO: {{ $pr->doc_number }}</p>
            </td>
        </tr>
    </table>

    <table style="margin-top: 20px;">
        <thead>
            <tr>
                <th style="width: 50%;">REQUISITION DETAILS</th>
                <th style="width: 50%;">DEPARTMENT & COST CENTER</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <p><span class="font-bold">Requester:</span> {{ $pr->requester->name }}</p>
                    <p><span class="font-bold">Procurement Type:</span> {{ $pr->procurementType->name }}</p>
                    <p><span class="font-bold">Suggested Vendor:</span> {{ $pr->suggestedVendor->name ?? '-' }}</p>
                </td>
                <td>
                    <p><span class="font-bold">Cost Center:</span> {{ $pr->costCenter->name }}</p>
                    <p><span class="font-bold">Department:</span> {{ $pr->department->name ?? '-' }}</p>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="mt-20">
        <p class="font-bold">Description:</p>
        <p style="font-size: 11px; margin-top: 5px; border: 1px solid #eee; padding: 10px;">{{ $pr->description }}</p>
    </div>

    <table class="mt-20">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 45%;">Item Description</th>
                <th style="width: 10%;" class="text-right">Qty</th>
                <th style="width: 10%;">Unit</th>
                <th style="width: 15%;" class="text-right">Est. Unit Price</th>
                <th style="width: 15%;" class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pr->items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
                    <p class="font-bold" style="margin: 0;">{{ $item->item->name }}</p>
                </td>
                <td class="text-right">{{ number_format($item->quantity, 2) }}</td>
                <td>{{ $item->item->unit->name }}</td>
                <td class="text-right">{{ number_format($item->estimated_unit_price, 2) }}</td>
                <td class="text-right">{{ number_format($item->subtotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table style="border: none; margin-top: 10px;">
        <tr style="border: none;">
            <td style="border: none; width: 60%;">
            </td>
            <td style="border: none; width: 40%;">
                <table style="border: none;">
                    <tr style="border: none; font-size: 14px; font-weight: bold;">
                        <td>TOTAL ESTIMATED</td>
                        <td class="text-right">{{ number_format($pr->total_estimated_amount, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <div style="margin-top: 50px;">
        <p class="font-bold">Approvals:</p>
        <table style="margin-top: 10px;">
            <thead>
                <tr>
                    <th style="width: 30%;">Step</th>
                    <th style="width: 30%;">Approver</th>
                    <th style="width: 20%;">Status</th>
                    <th style="width: 20%;">Date</th>
                </tr>
            </thead>
            <tbody>
                @forelse($pr->approvals as $approval)
                <tr>
                    <td>{{ $approval->step_name }}</td>
                    <td>{{ $approval->approver->name ?? '-' }}</td>
                    <td style="text-transform: uppercase;">{{ $approval->status }}</td>
                    <td>{{ $approval->processed_at ? $approval->processed_at->format('d M Y H:i') : '-' }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" style="text-align: center;">No approval history recorded.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div style="margin-top: 50px;">
        <table style="border: none;">
            <tr style="border: none;">
                <td style="border: none; width: 50%; text-align: center;">
                    <p>Requested By,</p>
                    <div style="height: 60px;"></div>
                    <p class="font-bold">{{ $pr->requester->name }}</p>
                    <p>{{ $pr->created_at->format('d M Y') }}</p>
                </td>
                <td style="border: none; width: 50%; text-align: center;">
                    <p>Verified By,</p>
                    <div style="height: 60px;"></div>
                    <p class="font-bold">.................</p>
                    <p>Date: .................</p>
                </td>
            </tr>
        </table>
    </div>
</div>