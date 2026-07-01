import 'package:flutter/material.dart';
import '../services/storage_service.dart';

class ReviewsListScreen extends StatelessWidget {
  const ReviewsListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final reviews = StorageService.instance.getReviews().where((r) => !r.isDraft).toList();
    return Scaffold(
      appBar: AppBar(title: const Text('My Reviews')),
      body: reviews.isEmpty
          ? const Center(child: Text('No submitted reviews yet.'))
          : ListView.builder(
              itemCount: reviews.length,
              itemBuilder: (_, i) {
                final r = reviews[i];
                return ListTile(
                  title: Text(r.courseInfo.courseName),
                  subtitle: Text('${r.courseInfo.datePlayed} · ${r.syncStatus}'),
                  trailing: Text(
                    '${r.letterGrade}\n${r.weightedScore.toStringAsFixed(1)}',
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                );
              },
            ),
    );
  }
}
